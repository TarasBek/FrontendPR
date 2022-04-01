const Joi = require("joi");
const express = require("express");
const db = require("./database");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

function validatePool(pool) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        volume_of_water: Joi.number().integer().required(),
        max_amount: Joi.number().integer().required(),
    });

    return schema.validate(pool);
}

// GET
app.get("/", (req, resp) => {
    resp.send("Hello, World!!!");
});

app.get("/api/pools", async(req, resp) => {
    let result = [];
    if (req.query.searchKey) {
        result = await db
            .promise()
            .query(
                `select * from pools where name like '%${req.query.searchKey}%';`
            );
    } else {
        result = await db.promise().query(`select * from pools`);
    }
    const pools = result[0];
    resp.status(200).send(pools);
});

app.get("/api/pools/:id", async(req, resp) => {
    // get pools by id
    const result = await db
        .promise()
        .query(`select * from pools where id='${req.params.id}'`);
    const pool = result[0][0];
    if (!pool) {
        return resp
            .status(404)
            .send("The pool with the given ID was not found.");
    }

    resp.send(pool);
});

// POST
app.post("/api/pools", (req, resp) => {
    // validate pool
    const { error } = validatePool(req.body); 
    if (error) {
        resp.status(400).send(error.details[0].message);
        return;
    }

    // store pool in db
    try {
        db.query(
            `insert into pools(name, volume_of_water, max_amount) value ('${req.body.name}', '${req.body.volume_of_water}', '${req.body.max_amount}')`
        );
        resp.status(200).send({ msg: "pool created" });
    } catch (err) {
        console.log(err);
    }
});

// PUT
app.put("/api/pools/:id", async(req, resp) => {
    // get pool by id
    const result = await db
        .promise()
        .query(`select * from pools where id='${req.params.id}'`);
    const pool = result[0][0];
    if (!pool) {
        return resp
            .status(404)
            .send("The pool with the given ID was not found.");
    }

    // validate pool
    const { error } = validatePool(req.body); // destructuring --> result.error
    if (error) {
        resp.status(400).send(error.details[0].message);
        return;
    }

    // update pool
    try {
        db.query(
            `update pools set name='${req.body.name}', volume_of_water='${req.body.volume_of_water}', max_amount='${req.body.max_amount}' where id='${req.params.id}'`
        );
    } catch (err) {
        console.log(err);
    }

    resp.send(pool);
});

// DELETE
app.delete("/api/pools/:id", async(req, resp) => {
    // get pool by id
    const result = await db
        .promise()
        .query(`select * from pools where id='${req.params.id}'`);
    const pool = result[0][0];

    // delete pool
    if (pool) {
        db.query(`delete from pools where id='${req.params.id}'`);
    } else {
        return resp.status(404).send("The pool with the given ID was not found.");
    }

    resp.send(pool);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});