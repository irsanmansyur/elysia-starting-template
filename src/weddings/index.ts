import Elysia from 'elysia';
import { ModelWedding } from './model';
import { weddingService } from './service';

export const weddingRoutes = new Elysia({
	name: 'wedding-routes',
	prefix: '/weddings',
	detail: {
		tags: ['Wedding Management'],
		summary: 'Wedding Management',
		description: 'Wedding Management',
	},
})

	.get(
		'/',
		async ({ query }) => {
			const { data, meta } = await weddingService.getWeddings(query);
			return { data, meta };
		},
		{
			query: ModelWedding.list,
		},
	)
	.get(
		'/:id',
		async ({ params }) => {
			const data = await weddingService.getWeddingById(params.id);
			return { data };
		},
		{
			params: ModelWedding.params,
		},
	)
	.get('/slug-check/:slug', async ({ params }) => {
		const data = await weddingService.checkSlugAvailable(params.slug);
		return { data };
	})
	.post(
		'/',
		async ({ body }) => {
			const data = await weddingService.createWedding(body);
			return { message: 'created wedding successfully', data };
		},
		{
			body: ModelWedding.create,
		},
	)
	.put(
		'/:id/step-1',
		async ({ params, body }) => {
			const data = await weddingService.updateStep1(params.id, body);
			return { message: 'updated wedding step 1 successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.update,
		},
	)
	.put(
		'/:id/step-2',
		async ({ params, body }) => {
			const data = await weddingService.updateStep2(params.id, body);
			return { message: 'updated wedding step 2 successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.UpdateStep2,
		},
	)
	.post(
		'/love-story/:id',
		async ({ params, body }) => {
			const data = await weddingService.addLoveStory(params.id, body);
			return { message: 'added love story successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.LoveStoryInsert,
		},
	)
	.delete(
		'/love-story/:id/:index',
		async ({ params }) => {
			const data = await weddingService.deleteLoveStory(params.id, +params.index);
			return { message: 'deleted love story successfully', data };
		},
		{
			params: ModelWedding.LoveStoryParams,
		},
	)
	.post(
		'/gallery/:id',
		async ({ params, body }) => {
			const data = await weddingService.addGallery(params.id, body);
			return { message: 'added gallery successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.GalleryInsert,
		},
	)
	.delete(
		'/gallery/:id/:index',
		async ({ params }) => {
			const data = await weddingService.deleteGallery(params.id, +params.index);
			return { message: 'deleted gallery successfully', data };
		},
		{
			params: ModelWedding.GalleryParams,
		},
	)
	.post(
		'/payment-method/:id',
		async ({ params, body }) => {
			const data = await weddingService.addPaymentMethod(params.id, body);
			return { message: 'added payment method successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.PaymentMethodInsert,
		},
	)
	.put(
		'/payment-method/:id/:index',
		async ({ params, body }) => {
			const data = await weddingService.updatePaymentMethod(params.id, +params.index, body);
			return { message: 'updated payment method successfully', data };
		},
		{
			params: ModelWedding.PaymentMethodParams,
			body: ModelWedding.PaymentMethodUpdate,
		},
	)
	.delete(
		'/payment-method/:id/:index',
		async ({ params }) => {
			const data = await weddingService.deletePaymentMethod(params.id, +params.index);
			return { message: 'deleted payment method successfully', data };
		},
		{
			params: ModelWedding.PaymentMethodParams,
		},
	)
	.post(
		'/quote/:id',
		async ({ params, body }) => {
			const data = await weddingService.addQuote(params.id, body);
			return { message: 'added quote successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.QuoteInsert,
		},
	)
	.put(
		'/quote/:id/:index',
		async ({ params, body }) => {
			const data = await weddingService.updateQuote(params.id, +params.index, body);
			return { message: 'updated quote successfully', data };
		},
		{
			params: ModelWedding.QuoteParams,
			body: ModelWedding.QuoteUpdate,
		},
	)
	.delete(
		'/quote/:id/:index',
		async ({ params }) => {
			const data = await weddingService.deleteQuote(params.id, +params.index);
			return { message: 'deleted quote successfully', data };
		},
		{
			params: ModelWedding.QuoteParams,
		},
	)
	.put(
		'/:id/step-akhir',
		async ({ params, body }) => {
			const data = await weddingService.updateStepAkhir(params.id, body);
			return { message: 'updated wedding step akhir successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.UpdateStepAkhir,
		},
	)
	.post(
		'/ucapan-data/:id',
		async ({ params, body }) => {
			const data = await weddingService.addUcapanData(params.id, body);
			return { message: 'added ucapan data successfully', data };
		},
		{
			params: ModelWedding.params,
			body: ModelWedding.UcapanDataInsert,
		},
	)
	.delete(
		'/ucapan-data/:id/:index',
		async ({ params }) => {
			const data = await weddingService.deleteUcapanData(params.id, +params.index);
			return { message: 'deleted ucapan data successfully', data };
		},
		{
			params: ModelWedding.UcapanDataParams,
		},
	);
