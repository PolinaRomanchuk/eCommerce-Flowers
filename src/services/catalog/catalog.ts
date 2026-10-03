const LIMIT_PRODUCTS_PER_PAGE = 6;

import type {
	Product,
	ProductProjection,
	ProductProjectionsResponse,
} from '../../types/catalog';
import { generalAuthFetch } from '../../utils/auth/general-fetch';
import { getFormatPrice } from '../../utils/format-attributes';

export async function fetchAllProducts(
	page: number,
	limit: number = LIMIT_PRODUCTS_PER_PAGE,
): Promise<{ products: Product[]; total: number }> {
	const offset = (page - 1) * limit;
	const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/product-projections?limit=${limit}&offset=${offset}`;
	try {
		const response = await generalAuthFetch(url, { method: 'GET' });
		if (!response.ok) {
			throw new Error('Failed to fetch products');
		}
		const data = await response.json();
		const transformed = transformResponse(data);
		return { products: transformed, total: data.total };
	}
	catch (error) {
		throw error;
	}
}

export async function fetchFilteredProducts(
	filter: {
		color?: string;
		occasion?: string;
		price?: string;
		type?: string;
		categoryId?: string;
	},
	sort: string,
	search: string,
	page: number = 1,
	limit: number = LIMIT_PRODUCTS_PER_PAGE,
): Promise<{ products: Product[]; total: number }> {
	const offset = (page - 1) * limit;

	const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;
	const apiUrl = process.env.REACT_APP_CT_API_URL;

	const searchUrl = `${apiUrl}/${projectKey}/products/search`;

	const filters: Record<string, unknown>[] = [];

	if (search.trim()) {
		filters.push({
			fullText: {
				field: 'name',
				language: 'en-US',
				value: search.trim(),
			},
		});
	}

	if (filter.categoryId) {
		filters.push({
			exact: {
				field: 'categories',
				value: filter.categoryId,
			},
		});
	}

	if (filter.type) {
		filters.push({
			exact: {
				field: 'productType',
				value: filter.type,
			},
		});
	}

	if (filter.color) {
		filters.push({
			exact: {
				field: 'variants.attributes.color',
				fieldType: 'text',
				value: filter.color,
			},
		});
	}

	if (filter.occasion) {
		filters.push({
			exact: {
				field: 'variants.attributes.occasion.key',
				fieldType: 'enum',
				value: filter.occasion,
			},
		});
	}

	if (filter.price) {
		const [fromString, toString] = filter.price.split('-');

		const from = fromString ? Number(fromString) * 100 : undefined;
		const to = toString ? Number(toString) * 100 : undefined;

		if (from !== undefined || to !== undefined) {
			filters.push({
				and: [
					{
						exact: {
							field: 'variants.prices.currencyCode',
							value: 'USD',
						},
					},
					{
						range: {
							field: 'variants.prices.currentCentAmount',
							...(from !== undefined && { gte: from }),
							...(to !== undefined && { lte: to }),
						},
					},
				],
			});
		}
	}

	const body: Record<string, unknown> = {
		limit,
		offset,
	};

	if (filters.length === 1) {
		body.query = filters[0];
	}
	else if (filters.length > 1) {
		body.query = {
			and: filters,
		};
	}

	if (sort) {
		body.sort = [convertSortToProductSearch(sort)];
	}

	const response = await generalAuthFetch(searchUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const error = await response.text();
		console.error('Product Search error:', error);
		throw new Error('Failed to search products');
	}

	const searchData = await response.json();

	const productIds: string[] = searchData.results.map(
		(item: { id: string }) => item.id,
	);

	if (productIds.length === 0) {
		return {
			products: [],
			total: searchData.total ?? 0,
		};
	}

	const productsUrl = new URL(
		`${apiUrl}/${projectKey}/product-projections`,
	);

	productsUrl.searchParams.set(
		'where',
		`id in (${productIds.map((id) => `"${id}"`).join(',')})`,
	);

	productsUrl.searchParams.set('limit', String(limit));
	productsUrl.searchParams.set('priceCurrency', 'USD');

	const productsResponse = await generalAuthFetch(
		productsUrl.toString(),
		{
			method: 'GET',
		},
	);

	if (!productsResponse.ok) {
		throw new Error('Failed to fetch product projections');
	}

	const productsData: ProductProjectionsResponse =
		await productsResponse.json();

	const productsById = new Map(
		productsData.results.map((product) => [product.id, product]),
	);

	const orderedProducts = productIds
		.map((id) => productsById.get(id))
		.filter(
			(product): product is ProductProjection =>
				product !== undefined,
		);

	return {
		products: transformResponse({
			...productsData,
			results: orderedProducts,
		}),
		total: searchData.total ?? 0,
	};
}

function convertSortToProductSearch(sort: string) {
	const [field, order = 'asc'] = sort.split(' ');

	switch (field) {
		case 'name.en-US':
			return {
				field: 'name',
				language: 'en-US',
				order,
			};

		case 'price':
			return {
				field: 'variants.prices.centAmount',
				order,
				mode: order === 'asc' ? 'min' : 'max',
			};

		default:
			return {
				field,
				order,
			};
	}
}

export function transformResponse(data: ProductProjectionsResponse): Product[] {
	return data.results.map((item: ProductProjection) => {
		const priceEntry = item.masterVariant?.prices?.[0];
		let fullPrice = '';
		const originalPrice = priceEntry?.value.centAmount ?? 0;
		fullPrice = getFormatPrice(originalPrice);
		const discountedPrice = priceEntry?.discounted?.value.centAmount;

		return {
			id: item.id,
			name: item.name?.['en-US'] ?? 'No name',
			description: item.description?.['en-US'] ?? '',
			image: item.masterVariant?.images?.[0]?.url ?? '',
			prices: fullPrice,
			discountedPrice: getFormatPrice(discountedPrice),
			masterVariantId: item.masterVariant?.id,
		};
	});
}
