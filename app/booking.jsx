'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { bookingToday, pets, services } from '../lib/booking-fields.js';

const BookingContext = createContext(null);
const storageKey = 'zhuazhua-booking';
const sendFailed = '预约邮件暂时无法发送，请稍后重试。';

export function BookingButton({ service, children, ...props }) {
  const openBooking = useContext(BookingContext);
  return (
    <button {...props} type="button" onClick={(event) => openBooking(event.currentTarget, service)}>
      {children}
    </button>
  );
}

export function BookingProvider({ children, timeZone }) {
  const dialog = useRef(null);
  const form = useRef(null);
  const opener = useRef(null);
  const attempt = useRef(null);
  const sending = useRef(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState('');

  function openBooking(button, preferredService) {
    const bookingForm = form.current;
    bookingForm.reset();
    flushSync(() => {
      setStatus('');
      setSent(false);
    });
    opener.current = button;

    const service = bookingForm.elements.namedItem('service');
    const pet = bookingForm.elements.namedItem('pet');
    const date = bookingForm.elements.namedItem('date');
    try {
      date.min = bookingToday(timeZone);
    } catch {
      date.removeAttribute('min');
    }

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) {
        if (services.includes(saved.service)) service.value = saved.service;
        if (pets.includes(saved.pet)) pet.value = saved.pet;
        if (typeof saved.date === 'string' && saved.date >= date.min) date.value = saved.date;
      }
    } catch {
      // Browsers with storage disabled can still submit a booking.
    }

    if (preferredService) service.value = preferredService;
    dialog.current.showModal();
    service.focus();
  }

  async function submitBooking(event) {
    event.preventDefault();
    if (sending.current || sent) return;

    const bookingForm = event.currentTarget;
    const formData = new FormData(bookingForm);
    const draft = {
      service: formData.get('service'),
      pet: formData.get('pet'),
      date: formData.get('date'),
    };
    const booking = { ...draft, phone: formData.get('phone').trim() };
    const fingerprint = JSON.stringify(booking);

    sending.current = true;
    setPending(true);
    setStatus('');
    try {
      if (attempt.current?.fingerprint !== fingerprint) {
        attempt.current = { fingerprint, id: crypto.randomUUID() };
      }
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ ...booking, id: attempt.current.id }),
      });
      const result = await response.json();
      if (!response.ok || result.id !== attempt.current.id) {
        setStatus(result.message || sendFailed);
        return;
      }

      attempt.current = null;
      bookingForm.elements.namedItem('phone').value = '';
      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {
        // A sent booking does not depend on browser storage.
      }
      setSent(true);
      setStatus(`预约意向已发送，店主将联系你确认时间。预约编号：${result.id}`);
    } catch {
      setStatus(sendFailed);
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      <dialog
        ref={dialog}
        id="booking"
        aria-labelledby="booking-title"
        aria-describedby="booking-note"
        onCancel={(event) => {
          if (sending.current) event.preventDefault();
        }}
        onClose={() => {
          form.current.elements.namedItem('phone').value = '';
          opener.current?.focus();
        }}
      >
        <div className="dialog-head">
          <h2 id="booking-title">预约洗护</h2>
          <button className="close" type="button" aria-label="关闭预约表单" disabled={pending} onClick={() => dialog.current.close()}>
            ×
          </button>
        </div>
        <p className="form-note" id="booking-note">提交后，店主会通过你填写的手机号联系你，确认到店时间。</p>
        <form ref={form} id="booking-form" onSubmit={submitBooking}>
          <label>洗护服务
            <select name="service" required disabled={pending || sent}>
              <option value="">请选择服务</option>
              {services.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>宠物种类
            <select name="pet" required disabled={pending || sent}>
              <option value="">请选择宠物种类</option>
              {pets.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>意向日期
            <input type="date" name="date" required disabled={pending || sent} />
          </label>
          <label>手机号
            <input type="tel" name="phone" autoComplete="tel" required minLength={7} maxLength={30} disabled={pending || sent} />
          </label>
          <button className="btn" type="submit" disabled={pending || sent}>
            {pending ? '正在发送…' : '发送预约意向'}
          </button>
          <p role="status" className={status ? 'feedback' : undefined} id="booking-status" hidden={!status}>{status}</p>
        </form>
      </dialog>
    </BookingContext.Provider>
  );
}
