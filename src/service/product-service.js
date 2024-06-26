import { createProductValidation, getProductValidation } from "../validation/product-validation.js";
import {prismaClient} from "../application/database.js";
import {validate} from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";

const create = async (user, file, request) => {
    const product = validate(createProductValidation, request);
    product.userId = user.id;
    product.cover = file.filename;

    return prismaClient.product.create({
        data: product,
        select: {
            id: true,
            cover: true,
            judul_buku: true,
            nama_penulis: true,
            deskripsi: true,
            harga: true
        }
    })
}

const get = async (user, productId) => {
    productId = validate(getProductValidation, productId);

    const product = await prismaClient.product.findFirst({
        where: {
            userId: user.id,
            id: productId
        },
        select: {
            id: true,
            judul_buku: true,
            nama_penulis: true,
            deskripsi: true,
            harga: true,
            cover: true
        }
    });

    if(!product){
        throw new ResponseError(404, "product is not found");
    }

    return product;
}

export default{
    create,
    get
}
