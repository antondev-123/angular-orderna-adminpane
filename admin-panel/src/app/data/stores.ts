import { getRandomBoolean } from '../../utils/dummy-data';
import { ICategory } from '../model/category';
import { CurrencyCode } from '../model/enum/currency-code';
import {
  IAddress,
  ICartItem,
  IOrderSummary,
  ICheckoutDetails,
  IOrderStatus,
  IOpeningHours,
  ITimeSlot,
  Store,
  WeeklyOpeningHours,
} from '../model/store';
import { PRODUCTS } from './products';

// Existing dummy data for address
const dummyAddress: IAddress = {
  email: '',
  zipCode: '12345',
  city: 'Example City',
  streetAddress: 'Example Street',
};

// Existing dummy building name or number
const buildingNumber: string = 'Building A';

const dummyTimeSlot: ITimeSlot[] = [
  {
    open: { selectedHours: '08', selectedMins: '00' },
    close: { selectedHours: '12', selectedMins: '00' },
  },
  {
    open: { selectedHours: '13', selectedMins: '00' },
    close: { selectedHours: '17', selectedMins: '00' },
  },
];

const dummyOpeningHours: WeeklyOpeningHours = {
  monday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  tuesday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  wednesday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  thursday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  friday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  saturday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  sunday: {
    timeSlots: cloneTimeSlots(dummyTimeSlot),
    isClosed: false,
    is24Hours: false,
  },
  // Repeat for other days
}

// Function to clone time slots for each day
function cloneTimeSlots(timeSlots: ITimeSlot[]): ITimeSlot[] {
  return timeSlots.map((slot) => ({ ...slot }));
}

export const CATEGORIES: ICategory[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index + 1,
    name: `Category ${index + 1}`,
    description: `Description ${index + 1}`,
    products: PRODUCTS.filter((product) => product.category === index + 1),
  })
);

// Existing dummy data for multiple stores
export const STORES: Store[] = Array.from({ length: 120 }, (_, index) =>
  Store.fromJSON({
    ...dummyAddress, // Spread the address properties
    buildingNumber, // Add the building name or number separately
    id: index + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: `Store ${index + 1}`,
    email: `store${index + 1}@example.com`,
    mobile: {
      number: '0912345678',
      countryCode: '+63',
    },
    telephone: {
      number: '0912345678',
      countryCode: '+63',
    },
    website: `https://store${index + 1}.com`,
    about: getRandomBoolean()
      ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec eros ut nulla tincidunt pretium. Aliquam erat volutpat. Integer ac tellus at neque elementum suscipit non at sapien.'
      : '',
    currency: CurrencyCode.PHP,
    VATNumber: `TAXID${index + 1}`, // Added taxId property
    openingHours: dummyOpeningHours, // Assign dummyOpeningHours here

    // TODO: Get value from other dummy data
    categoryCount: CATEGORIES.length,
    productCount: PRODUCTS.length,
    itemImagesCount: 0,
    itemDescriptionCount: 0,

    categories: CATEGORIES,

    isOpen: true,
  })
);

// New dummy data added below

// Dummy cart item data
const dummyCartItems: ICartItem[] = PRODUCTS.slice(0, 3).map((product) => ({
  product,
  quantity: 1,
}));

// Dummy order summary data
export const dummyOrderSummary: IOrderSummary = {
  items: dummyCartItems,
  totalAmount: dummyCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ),
};

// Dummy checkout details data
export const dummyCheckoutDetails: ICheckoutDetails = {
  shippingAddress: dummyAddress,
  paymentMethod: 'Credit Card',
  items: dummyCartItems,
};

// Dummy order status data
export const dummyOrderStatus: IOrderStatus = {
  orderId: 1,
  status: 'Pending',
  estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 5)),
};
