import {
    Schema,
    model,
    models,
    InferSchemaType,
    Model,
  } from "mongoose";

const OrderItemSchema = new Schema(
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
  
      name: {
        type: String,
        required: true,
        trim: true,
      },
  
      slug: {
        type: String,
        required: true,
        trim: true,
      },
  
      image: {
        type: String,
        default: "",
        trim: true,
      },
  
      sku: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },
  
      price: {
        type: Number,
        required: true,
        min: 0,
      },
  
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    {
      _id: false,
    }
  );

const ShippingAddressSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
  
      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
  
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
  
      city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
  
      state: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
  
      postalCode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
      },
  
      country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
    },
    {
      _id: false,
    }
  );
  
  const OrderSchema = new Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            uppercase: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
            validator: (items: unknown[]) => items.length > 0,
            message: "Order must contain at least one item",
            },
        },
  
        shippingAddress: {
            type: ShippingAddressSchema,
            required: true,
        },
  
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
    
        shipping: {
            type: Number,
            required: true,
            min: 0,
        },
    
        total: {
            type: Number,
            required: true,
            min: 0,
        },
    
        orderStatus: {
            type: String,
            enum: [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            ],
            default: "pending",
            index: true,
        },
    
        paymentStatus: {
            type: String,
            enum: [
            "pending",
            "paid",
            "failed",
            "refunded",
            ],
            default: "pending",
            index: true,
        },
        paymentMethod: {
          type: String,
          enum: ["jazzcash"],
          default: "jazzcash",
        },
        
        jazzCash: {
          txnRefNo: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
          },
        
          responseCode: {
            type: String,
            default: "",
          },
        
          responseMessage: {
            type: String,
            default: "",
          },
        
          retrievalReferenceNo: {
            type: String,
            default: "",
          },
        
          authCode: {
            type: String,
            default: "",
          },
        
          paidAt: {
            type: Date,
          },
        },

        stockDeducted: {
          type: Boolean,
          default: false,
        },

        fulfillmentError: {
          type: String,
          default: "",
        },

        cancelledAt: {
          type: Date,
        },

        statusHistory: {
          type: [
            new Schema(
              {
                status: {
                  type: String,
                  required: true,
                },
                note: {
                  type: String,
                  default: "",
                  maxlength: 500,
                },
                changedBy: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                },
                createdAt: {
                  type: Date,
                  default: Date.now,
                },
              },
              { _id: false }
            ),
          ],
          default: [],
        },
    },
    {
      timestamps: true,
    }
  );
  
  export type OrderType = InferSchemaType<typeof OrderSchema>;
  
  export type OrderItemType = InferSchemaType<typeof OrderItemSchema>;
  
  export type ShippingAddressType =
    InferSchemaType<typeof ShippingAddressSchema>;
  
  const Order =
    (models.Order as Model<OrderType>) ||
    model<OrderType>("Order", OrderSchema);
  
  export default Order;