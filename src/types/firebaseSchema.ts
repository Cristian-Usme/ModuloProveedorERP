/**
 * Firebase/Firestore Database Schema
 * Professional ERP Data Structure
 */

// ============================================
// AUTHENTICATION & USERS
// ============================================
export interface AuthUser {
  uid: string
  email: string
  emailVerified: boolean
  createdAt: string
  lastSignIn: string
}

export interface UserProfile {
  id: string // documentId = uid
  uid: string
  email: string
  fullName: string
  role: UserRole
  companyId: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  phone?: string
  department?: string
  createdAt: string
  updatedAt: string
  lastActive: string
}

export type UserRole = 'super_admin' | 'admin' | 'finance' | 'sales' | 'warehouse' | 'operator' | 'viewer'

// ============================================
// COMPANIES (Multi-tenant)
// ============================================
export interface Company {
  id: string // documentId
  name: string
  taxId: string // NIT or similar
  status: 'active' | 'inactive' | 'suspended'
  logo?: string
  website?: string
  industry?: string
  employees?: number
  createdAt: string
  updatedAt: string
  owner: string // uid of company owner
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'trial' | 'expired'
    expiresAt?: string
  }
}

// ============================================
// MASTER DATA - CUSTOMERS
// ============================================
export interface Customer {
  id: string
  companyId: string
  name: string
  taxId: string
  segment: string // 'retail', 'wholesale', 'industrial', etc.
  email: string
  phone: string
  city: string
  address?: string
  creditLimit: number
  currentCredit: number
  status: 'active' | 'pending' | 'blocked'
  createdAt: string
  updatedAt: string
  createdBy: string // uid
}

// ============================================
// MASTER DATA - SUPPLIERS
// ============================================
export interface Supplier {
  id: string
  companyId: string
  companyName: string
  contactName: string
  category: string
  email: string
  phone: string
  leadTimeDays: number
  paymentTerms?: string
  bank?: {
    accountNumber: string
    accountHolder: string
    bankName: string
  }
  status: 'active' | 'pending' | 'blocked'
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============================================
// MASTER DATA - PRODUCTS
// ============================================
export interface Product {
  id: string
  companyId: string
  sku: string
  name: string
  description?: string
  category: string
  unit: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  supplier?: string // supplierId
  costPrice: number
  salePrice: number
  minStock: number
  maxStock: number
  stock: number
  reorderPoint: number
  status: 'active' | 'inactive' | 'discontinued'
  images?: string[] // storage paths
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============================================
// WAREHOUSE MANAGEMENT
// ============================================
export interface Warehouse {
  id: string
  companyId: string
  name: string
  location: string
  address: string
  manager?: string // uid
  status: 'active' | 'inactive'
  createdAt: string
}

export interface InventoryLocation {
  id: string
  warehouseId: string
  productId: string
  sku: string
  zone: 'high_rotation' | 'medium' | 'low' | 'returns' | 'damage'
  rack: string
  shelf: string
  position: string
  quantity: number
  lastCountDate: string
  expiryDate?: string
  status: 'available' | 'reserved' | 'damaged' | 'expired'
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  companyId: string
  productId: string
  warehouseId: string
  type: 'in' | 'out' | 'adjustment' | 'damage'
  quantity: number
  reference?: string // purchase order, sales order, etc.
  reason?: string
  notes?: string
  createdAt: string
  createdBy: string
  relatedDocumentId?: string
}

// ============================================
// SALES
// ============================================
export interface SalesOrder {
  id: string
  companyId: string
  orderNumber: string
  customerId: string
  orderDate: string
  dueDate: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  discount?: number
  discountPercent?: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  notes?: string
  shippingAddress?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  confirmBy?: string
  shipBy?: string
}

export interface OrderItem {
  productId: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  discount?: number
  lineTotal: number
}

export interface Invoice {
  id: string
  companyId: string
  invoiceNumber: string
  salesOrderId: string
  customerId: string
  issueDate: string
  dueDate: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  paidAmount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============================================
// PURCHASES
// ============================================
export interface PurchaseOrder {
  id: string
  companyId: string
  poNumber: string
  supplierId: string
  orderDate: string
  expectedDelivery: string
  items: PurchaseItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'received' | 'partially_received' | 'cancelled'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface PurchaseItem {
  productId: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  receivedQuantity?: number
}

export interface GoodsReceipt {
  id: string
  companyId: string
  receiptNumber: string
  purchaseOrderId: string
  supplierId: string
  receiptDate: string
  items: ReceiptItem[]
  status: 'pending' | 'received' | 'inspected' | 'stored'
  notes?: string
  receivedBy: string
  createdAt: string
  updatedAt: string
}

export interface ReceiptItem {
  productId: string
  sku: string
  name: string
  poQuantity: number
  receivedQuantity: number
  rejectedQuantity: number
  notes?: string
}

// ============================================
// FINANCE & PAYMENTS
// ============================================
export interface Payment {
  id: string
  companyId: string
  paymentNumber: string
  type: 'receipt' | 'disbursement'
  amount: number
  currency?: string
  date: string
  documentType?: 'invoice' | 'purchase_order'
  documentId?: string
  paymentMethod: 'cash' | 'check' | 'transfer' | 'card'
  reference?: string
  status: 'pending' | 'processed' | 'cancelled'
  notes?: string
  createdAt: string
  createdBy: string
}

// ============================================
// SUPPORT & ADMIN
// ============================================
export interface SupportTicket {
  id: string
  companyId: string
  ticketNumber: string
  type: 'issue' | 'suggestion' | 'complaint'
  subject: string
  description: string
  relatedEntity?: 'customer' | 'supplier' | 'product' | 'order'
  relatedEntityId?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdBy: string // uid
  assignedTo?: string // uid
  comments?: TicketComment[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface TicketComment {
  id: string
  text: string
  authorId: string // uid
  createdAt: string
  attachments?: string[] // storage paths
}

export interface AuditLog {
  id: string
  companyId: string
  userId: string
  action: string
  entityType: string
  entityId: string
  changes?: Record<string, unknown>
  ipAddress?: string
  timestamp: string
}

export interface SystemNotification {
  id: string
  recipientId: string // uid
  type: 'low_stock' | 'payment_due' | 'order_status' | 'system_alert'
  title: string
  message: string
  relatedEntityId?: string
  read: boolean
  actionUrl?: string
  createdAt: string
  readAt?: string
}

// ============================================
// EXPORT ALL TYPES FOR CONVENIENCE
// ============================================
export type FirebaseDocument = 
  | UserProfile
  | Company
  | Customer
  | Supplier
  | Product
  | Warehouse
  | InventoryLocation
  | StockMovement
  | SalesOrder
  | Invoice
  | PurchaseOrder
  | GoodsReceipt
  | Payment
  | SupportTicket
  | AuditLog
  | SystemNotification
