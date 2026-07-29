import React, { useState, useEffect } from 'react';
import { Dumbbell, Printer, X, CheckCircle2 } from 'lucide-react';
import { settingsService } from '../services/settingsService';

export default function PrintableReceiptModal({ isOpen, onClose, receiptData }) {
  const [gymInfo, setGymInfo] = useState({
    name: 'Fitness Lover Gym',
    address: 'MG Road Sector 14',
    phone: '+91 98765 43210',
    gstin: '07AAACF1234H1Z5',
    receiptTerms: 'Fees once paid are non-refundable and non-transferable.'
  });

  useEffect(() => {
    if (isOpen) {
      settingsService.getSettings().then((s) => {
        if (s && s.name) setGymInfo(s);
      });
    }
  }, [isOpen]);

  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px', backgroundColor: '#ffffff', color: '#0f172a' }}>
        {/* Modal Controls Bar (Hidden when printed) */}
        <div className="no-print" style={{
          padding: '12px 20px',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#d4af37' }}>Official Payment Receipt</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ color: '#ffffff' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Printable Paper Receipt Document */}
        <div id="printable-receipt" style={{ padding: '32px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          
          {/* Header & Logo */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid #d4af37',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={26} color="#d4af37" />
                <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>{gymInfo.name}</h1>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', maxWidth: '280px' }}>
                {gymInfo.address}<br />
                Phone: {gymInfo.phone} | GSTIN: {gymInfo.gstin}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a'
              }}>
                OFFICIAL RECEIPT
              </span>
              <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '6px', color: '#0f172a' }}>
                #{receiptData.receiptNo}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Date: {receiptData.date}
              </div>
            </div>
          </div>

          {/* Member & Payment Details Grid */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#d4af37', textTransform: 'uppercase', marginBottom: '8px' }}>
              Transaction & Member Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div><strong>Member Name:</strong> {receiptData.member.name}</div>
              <div><strong>Member ID:</strong> {receiptData.member.id}</div>
              <div><strong>Contact Phone:</strong> {receiptData.member.phone}</div>
              <div><strong>Payment Method:</strong> <span style={{ color: '#0f172a', fontWeight: '700' }}>{receiptData.payment.mode}</span></div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>TRX / Ref ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>{receiptData.payment.ref || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Fee Particulars Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Description / Plan Name</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Validity</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 10px', fontWeight: '700' }}>
                  {receiptData.payment.planName}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', color: '#64748b' }}>
                  1 Month
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '800' }}>
                  Rs {receiptData.payment.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total & Next Due Date */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fffbe6',
            border: '1px solid #ffe58f',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '800' }}>
                NEXT FEE DUE DATE:
              </div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#d4af37' }}>
                {receiptData.payment.nextDueDate}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Amount Paid</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#15803d' }}>
                Rs {receiptData.payment.amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Terms & Conditions Note */}
          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '20px' }}>
            Note: {gymInfo.receiptTerms}
          </div>

          {/* Signatures & Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px dashed #cbd5e1',
            fontSize: '11px',
            color: '#64748b'
          }}>
            <div>
              <CheckCircle2 size={16} color="#16a34a" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Computer Generated Official Receipt
              <br />Channel: {receiptData.payment.mode} &bull; TRX ID: {receiptData.payment.ref}
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '24px', borderBottom: '1px solid #94a3b8', width: '130px', marginBottom: '4px' }}></div>
              <strong>Authorized Signatory</strong><br />{gymInfo.name}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
