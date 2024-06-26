import productService from "../service/product-service.js"

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        console.log(req.file);
        const cover = req.file;
        const result = await productService.create(user, cover, request);

        res.status(200).json({
            data: result,
            cover_url: `http://localhost:300/api/cover/${req.file.filename}`
        })
    }catch(e){
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const result = await productService.get(user, productId);
        console.log(result);

        res.status(200).json({
            data: result,
        })
    }catch(e){
        next(e)
    }
}

export default{
    create,
    get
}