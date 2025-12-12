import { eq } from 'drizzle-orm';
import { fileHelpers } from '~/utils/helpers/file';
import { generateMeta, paginate } from '~/utils/helpers/paginate';
import { DB } from '~/utils/plugins/database';
import { WeddingTemplateModel } from '~/utils/plugins/database/mongoose/schema';
import { templates } from '~/utils/plugins/database/schema';
import { HttpException } from '~/utils/plugins/errors/exception';
import type { ModelWedding } from './model';

export const weddingService = {
	async getWeddings(query: typeof ModelWedding.list.static) {
		const { limit, page, offset } = paginate(query);
		const search = query?.search;

		// Build search filter untuk mongoose
		const filter: Record<string, unknown> = {};
		if (search) {
			filter.$or = [{ slug: { $regex: search, $options: 'i' } }, { 'mempelai.groom.namaLengkap': { $regex: search, $options: 'i' } }, { 'mempelai.bride.namaLengkap': { $regex: search, $options: 'i' } }];
		}

		const [data, total] = await Promise.all([WeddingTemplateModel.find(filter).skip(offset).limit(limit).sort({ createdAt: -1 }), WeddingTemplateModel.countDocuments(filter)]);

		return { data, meta: generateMeta(total, page, limit) };
	},

	async getWeddingById(weddingId: string) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}
		return wedding;
	},

	async checkSlugAvailable(slug: string) {
		const existing = await WeddingTemplateModel.findOne({ slug: slug });
		return !existing;
	},

	async checkTemplateExists(templateId: string) {
		const template = await DB.Postgres.query.templates.findFirst({
			where: eq(templates.id, templateId),
		});
		if (!template) {
			throw new HttpException('Template not found', 404);
		}
		return template;
	},

	async createWedding(body: typeof ModelWedding.create.static) {
		const {
			templateId,
			coverFile,
			slug,
			priaNamaLengkap,
			priaAnakKe,
			priaNamaAyah,
			priaNamaIbu,
			priaPhotoFile,
			priaInstagram,
			wanitaNamaLengkap,
			wanitaAnakKe,
			wanitaNamaAyah,
			wanitaNamaIbu,
			wanitaPhotoFile,
			wanitaInstagram,
		} = body;

		// Cek template exists
		const template = await this.checkTemplateExists(templateId);

		// Buat document MongoDB dulu untuk dapat _id
		const now = new Date().toISOString();
		const weddingDoc = new WeddingTemplateModel({
			slug,
			templateId,
			templateName: template.name,
			createdAt: now,
			updatedAt: now,
			coverPhoto: '',
			mempelai: {
				groom: {
					namaLengkap: priaNamaLengkap,
					anakKe: priaAnakKe,
					namaAyah: priaNamaAyah,
					namaIbu: priaNamaIbu,
					instagram: priaInstagram,
					photoUrl: '',
				},
				bride: {
					namaLengkap: wanitaNamaLengkap,
					anakKe: wanitaAnakKe,
					namaAyah: wanitaNamaAyah,
					namaIbu: wanitaNamaIbu,
					instagram: wanitaInstagram,
					photoUrl: '',
				},
			},
		});

		await weddingDoc.save();
		const weddingId = weddingDoc._id.toString();

		// Simpan files
		const coverPhoto = await fileHelpers.saveFile(coverFile, `weddings/covers/${weddingId}`);
		const groomPhotoUrl = await fileHelpers.saveFile(priaPhotoFile, `persons/photos/groom-${weddingId}`);
		const bridePhotoUrl = await fileHelpers.saveFile(wanitaPhotoFile, `persons/photos/bride-${weddingId}`);

		// Update document dengan photo URLs
		weddingDoc.coverPhoto = coverPhoto;
		weddingDoc.mempelai.groom.photoUrl = groomPhotoUrl;
		weddingDoc.mempelai.bride.photoUrl = bridePhotoUrl;
		weddingDoc.step = 1;
		weddingDoc.updatedAt = new Date().toISOString();
		await weddingDoc.save();

		return weddingDoc;
	},

	async updateStep1(weddingId: string, body: typeof ModelWedding.update.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		// Update template jika ada
		if (body.templateId) {
			const template = await this.checkTemplateExists(body.templateId);
			wedding.templateId = body.templateId;
			wedding.templateName = template.name;
		}

		// Update slug jika ada
		if (body.slug) {
			wedding.slug = body.slug;
		}

		// Update cover photo jika ada (hapus yang lama)
		if (body.coverFile) {
			if (wedding.coverPhoto) {
				fileHelpers.deleteFile(wedding.coverPhoto);
			}
			wedding.coverPhoto = await fileHelpers.saveFile(body.coverFile, `weddings/covers/${weddingId}`);
		}

		// Update data pria
		if (body.priaNamaLengkap) wedding.mempelai.groom.namaLengkap = body.priaNamaLengkap;
		if (body.priaAnakKe) wedding.mempelai.groom.anakKe = body.priaAnakKe;
		if (body.priaNamaAyah) wedding.mempelai.groom.namaAyah = body.priaNamaAyah;
		if (body.priaNamaIbu) wedding.mempelai.groom.namaIbu = body.priaNamaIbu;
		if (body.priaInstagram !== undefined) wedding.mempelai.groom.instagram = body.priaInstagram;

		// Update photo pria jika ada (hapus yang lama)
		if (body.priaPhotoFile) {
			if (wedding.mempelai.groom.photoUrl) {
				fileHelpers.deleteFile(wedding.mempelai.groom.photoUrl);
			}
			wedding.mempelai.groom.photoUrl = await fileHelpers.saveFile(body.priaPhotoFile, `persons/photos/groom-${weddingId}`);
		}

		// Update data wanita
		if (body.wanitaNamaLengkap) wedding.mempelai.bride.namaLengkap = body.wanitaNamaLengkap;
		if (body.wanitaAnakKe) wedding.mempelai.bride.anakKe = body.wanitaAnakKe;
		if (body.wanitaNamaAyah) wedding.mempelai.bride.namaAyah = body.wanitaNamaAyah;
		if (body.wanitaNamaIbu) wedding.mempelai.bride.namaIbu = body.wanitaNamaIbu;
		if (body.wanitaInstagram !== undefined) wedding.mempelai.bride.instagram = body.wanitaInstagram;

		// Update photo wanita jika ada (hapus yang lama)
		if (body.wanitaPhotoFile) {
			if (wedding.mempelai.bride.photoUrl) {
				fileHelpers.deleteFile(wedding.mempelai.bride.photoUrl);
			}
			wedding.mempelai.bride.photoUrl = await fileHelpers.saveFile(body.wanitaPhotoFile, `persons/photos/bride-${weddingId}`);
		}

		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async updateStep2(weddingId: string, body: typeof ModelWedding.UpdateStep2.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		wedding.acara = {
			akadNikah: body.akadNikah,
			resepsiPria: body.resepsiPria,
			resepsiWanita: body.resepsiWanita,
		};
		wedding.step = 2;
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async addLoveStory(weddingId: string, body: typeof ModelWedding.LoveStoryInsert.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		let imageUrl: string | undefined;
		if (body.image) {
			const index = wedding.loveStory?.length || 0;
			imageUrl = await fileHelpers.saveFile(body.image, `weddings/love-story/${weddingId}/${index}`);
		}

		if (wedding.step < 3) {
			wedding.step = 3;
		}

		wedding.loveStory.push({
			tanggal: body.tanggal,
			title: body.title,
			desc: body.desc,
			image: imageUrl,
		});
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async deleteLoveStory(weddingId: string, index: number) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (index < 0 || index >= wedding.loveStory.length) {
			throw new HttpException('Love story index not found', 404);
		}

		const loveStory = wedding.loveStory[index];
		if (loveStory.image) {
			fileHelpers.deleteFile(loveStory.image);
		}

		wedding.loveStory.splice(index, 1);
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async addGallery(weddingId: string, body: typeof ModelWedding.GalleryInsert.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		const imageUrl = await fileHelpers.saveFile(body.image, `weddings/gallery/${weddingId}/${Date.now()}`);

		wedding.gallery.push({
			url: imageUrl,
			alt: body.alt || '',
			caption: body.caption,
		});
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async deleteGallery(weddingId: string, index: number) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (index < 0 || index >= wedding.gallery.length) {
			throw new HttpException('Gallery index not found', 404);
		}

		const galleryItem = wedding.gallery[index];
		if (galleryItem.url) {
			fileHelpers.deleteFile(galleryItem.url);
		}

		wedding.gallery.splice(index, 1);
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async addPaymentMethod(weddingId: string, body: typeof ModelWedding.PaymentMethodInsert.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		wedding.paymentMethods.push({
			name: body.name,
			type: body.type,
			account: body.account,
			holder: body.holder,
		});
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async updatePaymentMethod(weddingId: string, index: number, body: typeof ModelWedding.PaymentMethodUpdate.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (index < 0 || index >= wedding.paymentMethods.length) {
			throw new HttpException('Payment method index not found', 404);
		}

		const paymentMethod = wedding.paymentMethods[index];
		if (body.name !== undefined) paymentMethod.name = body.name;
		if (body.type !== undefined) paymentMethod.type = body.type;
		if (body.account !== undefined) paymentMethod.account = body.account;
		if (body.holder !== undefined) paymentMethod.holder = body.holder;

		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async deletePaymentMethod(weddingId: string, index: number) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (index < 0 || index >= wedding.paymentMethods.length) {
			throw new HttpException('Payment method index not found', 404);
		}

		wedding.paymentMethods.splice(index, 1);
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async addQuote(weddingId: string, body: typeof ModelWedding.QuoteInsert.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		wedding.quotes.push({
			title: body.title,
			defaultText: body.defaultText,
			otherText: body.otherText,
			source: body.source,
		});
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async updateQuote(weddingId: string, index: number, body: typeof ModelWedding.QuoteUpdate.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (index < 0 || index >= wedding.quotes.length) {
			throw new HttpException('Quote index not found', 404);
		}

		const quote = wedding.quotes[index];
		if (body.title !== undefined) quote.title = body.title;
		if (body.defaultText !== undefined) quote.defaultText = body.defaultText;
		if (body.otherText !== undefined) quote.otherText = body.otherText;
		if (body.source !== undefined) quote.source = body.source;

		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async deleteQuote(weddingId: string, index: number) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (index < 0 || index >= wedding.quotes.length) {
			throw new HttpException('Quote index not found', 404);
		}

		wedding.quotes.splice(index, 1);
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async updateStepAkhir(weddingId: string, body: typeof ModelWedding.UpdateStepAkhir.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		wedding.ucapanPenutup = {
			title: body.ucapanPenutup.title,
			desc: body.ucapanPenutup.desc,
		};

		if (body.videoInfo) {
			wedding.video = {
				url: body.videoInfo.url,
				title: body.videoInfo.title,
			};
		}

		wedding.step = 4;
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async addUcapanData(weddingId: string, body: typeof ModelWedding.UcapanDataInsert.static) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (!wedding.ucapanData) {
			wedding.ucapanData = [];
		}

		wedding.ucapanData.push({
			nama: body.nama,
			ucapan: body.ucapan,
			createdAt: new Date().toISOString(),
			isAnonymous: body.isAnonymous,
			hadir: body.hadir,
		});
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},

	async deleteUcapanData(weddingId: string, index: number) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) {
			throw new HttpException('Wedding not found', 404);
		}

		if (!wedding.ucapanData || index < 0 || index >= wedding.ucapanData.length) {
			throw new HttpException('Ucapan data index not found', 404);
		}

		wedding.ucapanData.splice(index, 1);
		wedding.updatedAt = new Date().toISOString();
		await wedding.save();

		return wedding;
	},
};
