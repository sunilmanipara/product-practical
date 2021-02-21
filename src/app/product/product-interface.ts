export interface Products {
    id: any;
    title: string;
    description: string;
    image_url: string;
    price: string | number;
    rating: string | number;
    location: any[];
    is_stock: boolean;
    is_favourite: boolean;
    is_soft_delete: boolean;
}
