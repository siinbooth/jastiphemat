import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Calendar, MapPin, Phone, Mail, Package, DollarSign, CheckCircle, Clock, X, Download, Share2 } from 'lucide-react'
import { supabase, Pesanan } from '../lib/supabase'

interface InvoiceData {
  id: string
  id_pesanan: string
  harga: number
  fee: number
  diskon: number
  dp: number
  total: number
  status: string
  created_at: string
}

const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [pesanan, setPesanan] = useState<Pesanan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchInvoiceData()
    }
  }, [id])

  const fetchInvoiceData = async () => {
    try {
      // Fetch invoice data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoice')
        .select('*')
        .eq('id', id)
        .single()

      if (invoiceError) throw invoiceError
      setInvoice(invoiceData)

      // Fetch pesanan data
      const { data: pesananData, error: pesananError } = await supabase
        .from('pesanan')
        .select('*')
        .eq('id', invoiceData.id_pesanan)
        .single()

      if (pesananError) throw pesananError
      setPesanan(pesananData)
    } catch (error) {
      console.error('Error fetching invoice data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Heart className="text-white" size={24} />
          </div>
          <p className="text-gray-600 font-poppins">Memuat invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice || !pesanan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={24} />
          </div>
          <p className="text-gray-600 font-poppins">Invoice tidak ditemukan</p>
        </div>
      </div>
    )
  }

  const sisaBayar = invoice.total - invoice.dp

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invoice Jastip by Livia',
          text: `Invoice untuk pesanan ${pesanan.nama}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link invoice berhasil disalin!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - Hidden when printing */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors font-poppins"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors font-poppins"
          >
            <Download size={16} />
            Print/Save
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 mb-6 print:shadow-none print:border-gray-300 print:rounded-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 font-poppins">Jastip by Livia</h1>
                <p className="text-gray-600 text-sm font-poppins">Layanan Titip Beli Terpercaya & Profesional</p>
                <p className="text-pink-600 text-xs font-medium font-poppins">📧 admin@jastipbylivia.com | 📱 +62 812-3456-7890</p>
              </div>
            </div>
            
            <div className="text-right bg-gray-50 p-4 rounded-xl border">
              <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Invoice Number</p>
              <p className="font-mono text-lg font-bold text-gray-800">#{invoice.id.slice(-8).toUpperCase()}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-poppins">{new Date(invoice.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                {invoice.status === 'lunas' ? (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold font-poppins flex items-center gap-1">
                    <CheckCircle size={12} />
                    LUNAS
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold font-poppins flex items-center gap-1">
                    <Clock size={12} />
                    PENDING
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm border-t border-gray-200 pt-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 font-poppins text-base border-b border-pink-200 pb-2">👤 BILL TO</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Nama Lengkap</p>
                  <p className="font-semibold text-gray-800 font-poppins">{pesanan.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Alamat</p>
                  <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-pink-400 mt-0.5" />
                    <span className="text-gray-700 font-poppins">{pesanan.alamat}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Telepon</p>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-pink-400" />
                      <span className="text-gray-700 font-poppins">{pesanan.no_hp}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-pink-400" />
                      <span className="text-gray-700 font-poppins text-xs">{pesanan.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 mb-4 font-poppins text-base border-b border-pink-200 pb-2">📦 ORDER DETAILS</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Item Description</p>
                  <div className="flex items-start gap-2">
                  <Package size={16} className="text-pink-400 mt-0.5" />
                    <span className="text-gray-700 font-poppins font-medium">{pesanan.barang}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Payment Method</p>
                    <p className="text-gray-700 font-poppins font-medium">{pesanan.metode_bayar}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Order Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-pink-400" />
                      <span className="text-gray-700 font-poppins">{new Date(invoice.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
                {pesanan.catatan && (
                  <div>
                    <p className="text-xs text-gray-500 font-poppins uppercase tracking-wide">Special Notes</p>
                    <p className="text-gray-700 font-poppins italic">{pesanan.catatan}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 print:shadow-none print:border-gray-300 print:rounded-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 font-poppins flex items-center gap-3 border-b border-gray-200 pb-4">
            <DollarSign size={24} className="text-pink-500" />
            PAYMENT BREAKDOWN
          </h2>

          <div className="space-y-1 mb-6">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-poppins">Item Price</span>
              <span className="font-semibold font-poppins text-gray-800">Rp {invoice.harga.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-poppins">Service Fee</span>
              <span className="font-semibold font-poppins text-gray-800">Rp {invoice.fee.toLocaleString('id-ID')}</span>
            </div>
            {invoice.diskon > 0 && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-poppins">Discount</span>
                <span className="font-semibold text-green-600 font-poppins">-Rp {invoice.diskon.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800 font-poppins">TOTAL AMOUNT</span>
              <span className="text-3xl font-bold text-pink-600 font-poppins">Rp {invoice.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
            
            {invoice.dp > 0 && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-poppins font-medium">Down Payment (Paid)</span>
                    <span className="font-bold text-blue-600 font-poppins">Rp {invoice.dp.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-700 font-poppins">REMAINING BALANCE</span>
                    <span className="text-2xl font-bold text-red-600 font-poppins">Rp {sisaBayar.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}

          {/* Payment Status */}
          <div className="mt-10 text-center">
            {invoice.status === 'lunas' ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 p-6 rounded-2xl">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-700 font-bold font-poppins text-2xl">✅ PAYMENT COMPLETED</p>
                <p className="text-green-600 font-poppins mt-2">Thank you for your trust in our service!</p>
                <div className="mt-4 text-xs text-green-600 font-poppins">
                  Payment completed on {new Date(invoice.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 p-6 rounded-2xl">
                <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-yellow-700 font-bold font-poppins text-2xl">⏳ PAYMENT PENDING</p>
                <p className="text-yellow-600 font-poppins mt-2">
                  {sisaBayar > 0 ? `Outstanding balance: Rp ${sisaBayar.toLocaleString('id-ID')}` : 'Please complete payment as per total amount above'}
                </p>
                <div className="mt-4 bg-white p-3 rounded-lg border border-yellow-200">
                  <p className="text-xs text-gray-600 font-poppins">
                    💳 Transfer to: <strong>BCA 1234567890 a.n. Livia</strong><br/>
                    📱 Or contact us via WhatsApp for payment assistance
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl shadow-xl border border-pink-200 p-8 mt-6 print:shadow-none print:border-gray-300 print:rounded-none">
          <h3 className="font-bold text-gray-800 mb-6 font-poppins text-xl text-center">📞 CONTACT INFORMATION</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-500 font-poppins text-xs uppercase tracking-wide">WhatsApp</p>
                <p className="font-bold text-pink-600 font-poppins text-lg">+62 812-3456-7890</p>
              </div>
            </div>
            <div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-500 font-poppins text-xs uppercase tracking-wide">Email</p>
                <p className="font-bold text-pink-600 font-poppins">admin@jastipbylivia.com</p>
              </div>
            </div>
            <div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-500 font-poppins text-xs uppercase tracking-wide">Instagram</p>
                <p className="font-bold text-pink-600 font-poppins">@jastipbylivia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 print:mt-8 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold text-gray-800 font-poppins">Jastip by Livia</span>
          </div>
          <p className="text-gray-500 text-sm font-poppins">© 2025 Jastip by Livia. Made with 💖</p>
          <p className="text-gray-400 text-xs font-poppins mt-1">Professional & Trusted Personal Shopping Service</p>
          <div className="mt-4 text-xs text-gray-400 font-poppins">
            This invoice was generated automatically by our system on {new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePage