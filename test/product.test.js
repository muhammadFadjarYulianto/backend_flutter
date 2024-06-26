import supertest from "supertest";
import {createTestProduct, createTestUser, getTestProduct, removeAllTestProducts, removeTestUser, removeTestUserLogin} from "./test-util.js";
import {app} from "../src/application/app.js"
import { logger } from "../src/application/logging.js";
import path from 'path';

describe('POST /api/products', function () {

    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUserLogin();
    })

    it('should can create new product', async () => {
        const filePath = path.resolve(__dirname, 'test-files', 'test-image.jpg'); // Path to a test image file
        const result = await supertest(app)
            .post("/api/products")
            .set('Authorization', 'test')
            .field('judul_buku', 'test')
            .field('nama_penulis', 'test')
            .field('deskripsi', 'test')
            .field('harga', '123456')
            .attach('cover', filePath);
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.cover).toBeDefined();
        expect(result.body.data.judul_buku).toBe("test");
        expect(result.body.data.nama_penulis).toBe("test");
        expect(result.body.data.deskripsi).toBe("test");
        expect(result.body.data.harga).toBe("123456");
        expect(result.body.cover_url).toBeDefined();
    });
})

describe('GET /api/products/:productId', function () {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUserLogin();
    })

    it('should can get product', async () => {
        const filePath = path.resolve(__dirname, 'test-files', 'test-image.jpg'); // Path to a test image file
        let result = await supertest(app)
            .post("/api/products")
            .set('Authorization', 'test')
            .field('judul_buku', 'test')
            .field('nama_penulis', 'test')
            .field('deskripsi', 'test')
            .field('harga', '123456')
            .attach('cover', filePath);
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.cover).toBeDefined();
        expect(result.body.data.judul_buku).toBe("test");
        expect(result.body.data.nama_penulis).toBe("test");
        expect(result.body.data.deskripsi).toBe("test");
        expect(result.body.data.harga).toBe("123456");
        expect(result.body.cover_url).toBeDefined();

        const testProduct = await getTestProduct();
        result = await supertest(app)
            .get("/api/products/" + testProduct.id)
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testProduct.id);
        expect(result.body.data.judul_buku).toBe(testProduct.judul_buku);
        expect(result.body.data.nama_penulis).toBe(testProduct.nama_penulis);
        expect(result.body.data.deskripsi).toBe(testProduct.deskripsi);
        expect(result.body.data.harga).toBe(testProduct.harga);
        expect(result.body.data.cover).toBe(testProduct.cover);
    });
})