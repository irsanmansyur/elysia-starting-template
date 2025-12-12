import { t } from 'elysia';
import { PaginateDto } from '~/utils/plugins/validators/general';

const EventInfo = t.Object({
	tanggal: t.String(),
	waktu: t.String(),
	alamat: t.String(),
	tempat: t.String(),
});

export const ModelWedding = {
	create: t.Object({
		templateId: t.String({ minLength: 1 }),
		slug: t.String({ minLength: 1 }),
		coverFile: t.File(),
		// Pria
		priaNamaLengkap: t.String({ minLength: 1 }),
		priaAnakKe: t.String({ minLength: 1 }),
		priaNamaAyah: t.String({ minLength: 1 }),
		priaNamaIbu: t.String({ minLength: 1 }),
		priaPhotoFile: t.File(),
		priaInstagram: t.Optional(t.String()),
		// Wanita
		wanitaNamaLengkap: t.String({ minLength: 1 }),
		wanitaAnakKe: t.String({ minLength: 1 }),
		wanitaNamaAyah: t.String({ minLength: 1 }),
		wanitaNamaIbu: t.String({ minLength: 1 }),
		wanitaPhotoFile: t.File(),
		wanitaInstagram: t.Optional(t.String()),
	}),
	update: t.Object({
		templateId: t.Optional(t.String({ minLength: 1 })),
		slug: t.Optional(t.String({ minLength: 1 })),
		coverFile: t.Optional(t.File()),

		// Pria
		priaNamaLengkap: t.Optional(t.String({ minLength: 1 })),
		priaAnakKe: t.Optional(t.String({ minLength: 1 })),
		priaNamaAyah: t.Optional(t.String({ minLength: 1 })),
		priaNamaIbu: t.Optional(t.String({ minLength: 1 })),
		priaPhotoFile: t.Optional(t.File()),
		priaInstagram: t.Optional(t.String()),

		// Wanita
		wanitaNamaLengkap: t.Optional(t.String({ minLength: 1 })),
		wanitaAnakKe: t.Optional(t.String({ minLength: 1 })),
		wanitaNamaAyah: t.Optional(t.String({ minLength: 1 })),
		wanitaNamaIbu: t.Optional(t.String({ minLength: 1 })),
		wanitaPhotoFile: t.Optional(t.File()),
		wanitaInstagram: t.Optional(t.String()),
	}),

	list: t.Object({
		...PaginateDto.properties,
	}),
	params: t.Object({
		id: t.String(),
	}),

	UpdateStep2: t.Object({
		akadNikah: EventInfo,
		resepsiPria: t.Optional(EventInfo),
		resepsiWanita: t.Optional(EventInfo),
	}),
	LoveStoryInsert: t.Object({
		tanggal: t.String({ minLength: 1 }),
		title: t.String({ minLength: 1 }),
		desc: t.String({ minLength: 1 }),
		image: t.Optional(t.File()),
	}),
	LoveStoryParams: t.Object({
		id: t.String(),
		index: t.String(),
	}),
	GalleryInsert: t.Object({
		image: t.File(),
		alt: t.Optional(t.String()),
		caption: t.Optional(t.String()),
	}),
	GalleryParams: t.Object({
		id: t.String(),
		index: t.String(),
	}),
	PaymentMethodInsert: t.Object({
		name: t.String({ minLength: 1 }),
		type: t.Union([t.Literal('bank'), t.Literal('e-wallet')]),
		account: t.String({ minLength: 1 }),
		holder: t.String({ minLength: 1 }),
	}),
	PaymentMethodUpdate: t.Object({
		name: t.Optional(t.String({ minLength: 1 })),
		type: t.Optional(t.Union([t.Literal('bank'), t.Literal('e-wallet')])),
		account: t.Optional(t.String({ minLength: 1 })),
		holder: t.Optional(t.String({ minLength: 1 })),
	}),
	PaymentMethodParams: t.Object({
		id: t.String(),
		index: t.String(),
	}),
	QuoteInsert: t.Object({
		title: t.String({ minLength: 1 }),
		defaultText: t.String({ minLength: 1 }),
		otherText: t.Optional(t.String({})),
		source: t.String({ minLength: 1 }),
	}),
	QuoteUpdate: t.Object({
		title: t.Optional(t.String({ minLength: 1 })),
		defaultText: t.Optional(t.String({ minLength: 1 })),
		otherText: t.Optional(t.String()),
		source: t.Optional(t.String({ minLength: 1 })),
	}),
	QuoteParams: t.Object({
		id: t.String(),
		index: t.String(),
	}),
	UpdateStepAkhir: t.Object({
		ucapanPenutup: t.Object({
			title: t.String({ minLength: 1 }),
			desc: t.String({ minLength: 1 }),
		}),
		videoInfo: t.Optional(
			t.Object({
				url: t.String({ minLength: 1 }),
				title: t.String({ minLength: 1 }),
			}),
		),
	}),
	UcapanDataInsert: t.Object({
		nama: t.String({ minLength: 1 }),
		ucapan: t.String({ minLength: 1 }),
		isAnonymous: t.Boolean({ default: false }),
		hadir: t.Boolean({ default: false }),
	}),
	UcapanDataParams: t.Object({
		id: t.String(),
		index: t.String(),
	}),
};
