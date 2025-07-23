// admin.model.js
const mongoose = require("mongoose");

const BasicPermission = new mongoose.Schema(
  {
    all: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

const MenuSectionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

const CustomerPermissionSchema = new mongoose.Schema(
  {
    user: { type: BasicPermission, default: () => ({}) },
    agency: { type: BasicPermission, default: () => ({}) },
    view: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderPermission = new mongoose.Schema(
  {
    all: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    chat: { type: Boolean, default: false },
    info: { type: Boolean, default: false },
    transaction: { type: Boolean, default: false },
    paymentStatus: {
      all: { type: Boolean, default: false },
      pending: { type: Boolean, default: false },
      waiting: { type: Boolean, default: false },
      working: { type: Boolean, default: false },
      stopped: { type: Boolean, default: false },
      complete: { type: Boolean, default: false },
      delivery: { type: Boolean, default: false },
      refund: { type: Boolean, default: false },
      cancel: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

const OrderPermissionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    technical: OrderPermission,
    construction: OrderPermission,
    realEstate: OrderPermission,
    visaTraveling: OrderPermission,
    export: OrderPermission,
    hiring: OrderPermission,
    business: OrderPermission,
    webdev: OrderPermission,
  },
  { _id: false }
);

const MenuPermissionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    gallery: MenuSectionSchema,
    technical: MenuSectionSchema,
    construction: MenuSectionSchema,
    realEstate: MenuSectionSchema,
    importExport: MenuSectionSchema,
    visaTraveling: MenuSectionSchema,
    notice: MenuSectionSchema,
    employer: MenuSectionSchema,
    blog: MenuSectionSchema,
    globalLocation: MenuSectionSchema,
    contactUs: MenuSectionSchema,
    company: MenuSectionSchema,
  },
  { _id: false }
);

const LiveChatPermissionSchema = new mongoose.Schema(
  {
    all: { type: Boolean, default: false },
    technical: { type: Boolean, default: false },
    construction: { type: Boolean, default: false },
    importExport: { type: Boolean, default: false },
    business: { type: Boolean, default: false },
    realEstate: { type: Boolean, default: false },
    visaTraveling: { type: Boolean, default: false },
    hiring: { type: Boolean, default: false },
    account: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    agency: { type: Boolean, default: false },
    return: { type: Boolean, default: false },
  },
  { _id: false }
);

const PermissionsSchema = new mongoose.Schema(
  {
    dashboards: { type: BasicPermission, default: () => ({}) },
    mainadmin: { type: Boolean, default: false },
    monthlyPayTrack: { type: BasicPermission, default: () => ({}) },
    agency: { type: BasicPermission, default: () => ({}) },
    payment: { type: BasicPermission, default: () => ({}) },
    customer: { type: CustomerPermissionSchema, default: () => ({}) },
    orders: { type: OrderPermissionSchema, default: () => ({}) },
    menu: { type: MenuPermissionSchema, default: () => ({}) },
    liveChat: { type: LiveChatPermissionSchema, default: () => ({}) },
  },
  { _id: false }
);

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email format",
      },
    },
    login_url: { type: String, trim: true },
    login_code: { type: String, trim: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ["main-admin", "sub-admin"],
      default: "sub-admin",
    },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AdminSchema.methods.hasPermission = function (section, action = "view") {
  if (this.role === "main-admin") return true;
  if (!this.isActive) return false;
  if (this.permissions.mainadmin === true) return true;
  const sec = this.permissions?.[section];
  if (!sec) return false;
  if (sec.all) return true;
  return !!sec[action];
};

AdminSchema.methods.grantFullAccess = function () {
  const full = () => ({
    all: true,
    view: true,
    create: true,
    update: true,
    delete: true,
  });

  const fullOrder = () => ({
    all: true,
    view: true,
    create: true,
    update: true,
    delete: true,
    chat: true,
    info: true,
    transaction: true,
    paymentStatus: {
      all: true,
      pending: true,
      waiting: true,
      working: true,
      stopped: true,
      complete: true,
      delivery: true,
      refund: true,
      cancel: true,
    },
  });

  this.permissions = {
    dashboards: full(),
    mainadmin: true,
    monthlyPayTrack: full(),
    agency: full(),
    payment: full(),
    customer: {
      user: full(),
      agency: full(),
      view: true,
    },
    orders: {
      view: true,
      technical: fullOrder(),
      construction: fullOrder(),
      realEstate: fullOrder(),
      visaTraveling: fullOrder(),
      export: fullOrder(),
      hiring: fullOrder(),
      business: fullOrder(),
      webdev: fullOrder(),
    },
    menu: {
      view: true,
      gallery: full(),
      technical: full(),
      construction: full(),
      realEstate: full(),
      importExport: full(),
      visaTraveling: full(),
      notice: full(),
      employer: full(),
      blog: full(),
      globalLocation: full(),
      contactUs: full(),
      company: full(),
    },
    liveChat: {
      all: true,
      technical: true,
      construction: true,
      importExport: true,
      business: true,
      realEstate: true,
      visaTraveling: true,
      hiring: true,
      account: true,
      orders: true,
      payment: true,
      agency: true,
      return: true,
    },
  };
  return this.save();
};

module.exports = mongoose.model("Admins", AdminSchema);
