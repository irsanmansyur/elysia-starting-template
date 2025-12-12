import { type Document, model, Schema } from 'mongoose';

/* -------------------------------------------------------------
 * -------------- TypeScript Interfaces (Full) -----------------
 * ------------------------------------------------------------- */

export interface PersonInfo {
	namaLengkap: string;
	anakKe: string;
	namaAyah: string;
	namaIbu: string;
	instagram?: string;
	photoUrl: string;
}

export interface EventInfo {
	tanggal: string;
	waktu: string;
	alamat: string;
	tempat: string;
}

export interface Quote {
	title: string;
	defaultText: string;
	otherText?: string;
	source: string;
}

export interface LoveStory {
	image?: string;
	tanggal: string;
	title: string;
	desc: string;
}

export interface GalleryItem {
	url: string;
	alt: string;
	caption?: string;
}

export type PaymentMethodType = 'bank' | 'e-wallet';

export interface PaymentMethod {
	name: string;
	type: PaymentMethodType;
	account: string;
	holder: string;
}

export interface VideoInfo {
	url: string;
	title: string;
}

export interface UcapanData {
	nama: string;
	ucapan: string;
	createdAt: string;
	isAnonymous: boolean;
	hadir: boolean;
}

export interface WeddingTemplateData {
	slug: string;
	templateId: string;
	templateName: string;
	createdAt: string;
	updatedAt: string;
	coverPhoto: string;
	step: number;

	mempelai: {
		groom: PersonInfo;
		bride: PersonInfo;
	};

	acara: {
		akadNikah: EventInfo;
		resepsiPria?: EventInfo;
		resepsiWanita?: EventInfo;
	};

	quotes: Quote[];
	loveStory: LoveStory[];
	gallery: GalleryItem[];
	paymentMethods: PaymentMethod[];

	video?: VideoInfo;
	backgroundMusic?: string;
	ucapanData?: UcapanData[];

	undanganUntuk?: {
		nama: string;
		alamat?: string;
	};

	ucapan?: {
		title: string;
		desc: string;
	};

	ucapanPenutup?: {
		title: string;
		desc: string;
	};
}

/* -------------------------------------------------------------
 * --------------------- Sub Schemas ---------------------------
 * ------------------------------------------------------------- */

const PersonInfoSchema = new Schema<PersonInfo>({
	namaLengkap: { type: String, required: true },
	anakKe: { type: String, required: true },
	namaAyah: { type: String, required: true },
	namaIbu: { type: String, required: true },
	instagram: { type: String },
	photoUrl: { type: String },
});

const EventInfoSchema = new Schema<EventInfo>({
	tanggal: { type: String, required: true },
	waktu: { type: String, required: true },
	alamat: { type: String, required: true },
	tempat: { type: String, required: true },
});

const QuoteSchema = new Schema<Quote>({
	title: { type: String, required: true },
	defaultText: { type: String, required: true },
	otherText: { type: String },
	source: { type: String, required: true },
});

const LoveStorySchema = new Schema<LoveStory>({
	image: { type: String },
	tanggal: { type: String, required: true },
	title: { type: String, required: true },
	desc: { type: String, required: true },
});

const GalleryItemSchema = new Schema<GalleryItem>({
	url: { type: String, required: true },
	alt: { type: String, required: true },
	caption: { type: String },
});

const PaymentMethodSchema = new Schema<PaymentMethod>({
	name: { type: String, required: true },
	type: { type: String, enum: ['bank', 'e-wallet'], required: true },
	account: { type: String, required: true },
	holder: { type: String, required: true },
});

const VideoInfoSchema = new Schema<VideoInfo>({
	url: { type: String },
	title: { type: String },
});

const UcapanDataSchema = new Schema<UcapanData>({
	nama: { type: String, required: true },
	ucapan: { type: String, required: true },
	createdAt: { type: String, required: true },
	isAnonymous: { type: Boolean, default: false },
	hadir: { type: Boolean, default: false },
});

/* -------------------------------------------------------------
 * -------------------- Main Document Type ---------------------
 * ------------------------------------------------------------- */

export interface WeddingTemplateDataDoc extends WeddingTemplateData, Document {}

/* -------------------------------------------------------------
 * ----------------------- Main Schema -------------------------
 * ------------------------------------------------------------- */

const WeddingTemplateSchema = new Schema<WeddingTemplateDataDoc>(
	{
		slug: { type: String, required: true },
		step: { type: Number, default: 0 },
		templateId: { type: String, required: true },
		templateName: { type: String, required: true },
		createdAt: { type: String, required: true },
		updatedAt: { type: String, required: true },
		coverPhoto: { type: String },

		mempelai: {
			groom: { type: PersonInfoSchema, required: true },
			bride: { type: PersonInfoSchema, required: true },
		},

		acara: {
			akadNikah: { type: EventInfoSchema },
			resepsiPria: EventInfoSchema,
			resepsiWanita: EventInfoSchema,
		},

		quotes: [QuoteSchema],
		loveStory: [LoveStorySchema],
		gallery: [GalleryItemSchema],
		paymentMethods: [PaymentMethodSchema],

		video: VideoInfoSchema,
		backgroundMusic: String,
		ucapanData: [UcapanDataSchema],

		undanganUntuk: {
			nama: String,
			alamat: String,
		},

		ucapan: {
			title: String,
			desc: String,
		},

		ucapanPenutup: {
			title: String,
			desc: String,
		},
	},
	{ timestamps: false },
);

/* -------------------------------------------------------------
 * ------------------------- Model -----------------------------
 * ------------------------------------------------------------- */

export const WeddingTemplateModel = model<WeddingTemplateDataDoc>('WeddingTemplate', WeddingTemplateSchema);
