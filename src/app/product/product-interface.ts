export interface Products {
    id: any;
    title: string;
    description: string;
    image_url: string;
    price: string | number;
    rating: string | number;
    location: any;
    stock: string | number;
    is_favourite: boolean;
    is_soft_delete: boolean;
}
