/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'admin' | 'donor' | 'receiver'} role
 * @property {string} phone
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zip_code
 * @property {string} created_at
 */

/**
 * @typedef {Object} Donation
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} food_type
 * @property {string} quantity
 * @property {string} expiry_date
 * @property {string} pickup_location
 * @property {string} contact_info
 * @property {'available' | 'reserved' | 'completed'} status
 * @property {string} [image_url]
 * @property {number} donor_id
 * @property {string} [donor_name]
 * @property {string} created_at
 */

/**
 * @typedef {Object} Request
 * @property {number} id
 * @property {number} donation_id
 * @property {number} receiver_id
 * @property {'pending' | 'accepted' | 'rejected' | 'completed'} status
 * @property {string} message
 * @property {string} requested_at
 * @property {string} title
 * @property {string} food_type
 * @property {string} quantity
 * @property {string} receiver_name
 * @property {string} receiver_phone
 * @property {string} receiver_email
 */

/**
 * @typedef {Object} Notification
 * @property {number} id
 * @property {number} user_id
 * @property {string} title
 * @property {string} message
 * @property {'request' | 'approval' | 'completion' | 'system'} type
 * @property {boolean} is_read
 * @property {string} created_at
 */

/**
 * @typedef {Object} AdminStats
 * @property {Object} users
 * @property {number} users.total
 * @property {number} users.admin
 * @property {number} users.donor
 * @property {number} users.receiver
 * @property {Object} donations
 * @property {number} donations.total
 * @property {number} donations.available
 * @property {number} donations.reserved
 * @property {number} donations.completed
 * @property {Object} requests
 * @property {number} requests.total
 * @property {number} requests.pending
 * @property {number} requests.accepted
 * @property {number} requests.rejected
 * @property {number} requests.completed
 * @property {Object} recentActivity
 * @property {number} recentActivity.donations
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {string | null} token
 * @property {(email: string, password: string) => Promise<void>} login
 * @property {(userData: RegisterData) => Promise<void>} register
 * @property {() => void} logout
 * @property {boolean} loading
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'donor' | 'receiver'} role
 * @property {string} phone
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {string} message
 * @property {T} [data]
 */

/**
 * @typedef {Object} DonationFormData
 * @property {string} title
 * @property {string} description
 * @property {string} foodType
 * @property {string} quantity
 * @property {string} expiryDate
 * @property {string} pickupLocation
 * @property {string} contactInfo
 * @property {string} [imageUrl]
 */

// These are exported for documentation purposes
export { };
