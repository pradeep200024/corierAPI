const dbConfig = require("../lib/db");
exports.IndexController = (req, res) => {
  try {
    const getOrders = `SELECT id,vehicle,
        destination,
        order_id,
        status,
        estimated_date,
        departure_date FROM delivery`;
    dbConfig.query(getOrders, (err, result) => {
      if (err) throw err;
      res.status(200).json({ data: result });
    });
  } catch (error) {}
};
exports.IndexGetByIdController = (req, res) => {
  try {
    dbConfig.query(
      "SELECT * FROM `delivery` WHERE id = ?",
      [req.params.id],

      (err, result) => {
        if (err) throw err;
        res.status(200).json({ data: result });
      }
    );
  } catch (error) {}
};

exports.IndexPostController = (req, res) => {
  const dataFromAPI = req.body;

  try {
    const insertQuery = `
      INSERT INTO delivery (
        branch_pickup,
        vehicle,
        date,
        destination,
        order_id,
        status,
        estimated_date,
        customer_id,
        telephone_number,
        departure_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    dbConfig.query(
      insertQuery,
      [
        dataFromAPI.branch_pickup,
        dataFromAPI.vehicle,
        dataFromAPI.date,
        dataFromAPI.destination,
        dataFromAPI.order_id,
        dataFromAPI.status,
        dataFromAPI.estimated_date,
        dataFromAPI.customer_id,
        dataFromAPI.telephone_number,
        dataFromAPI.departure_date,
      ],
      (error, results) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            res
              .status(400)
              .json({ error: "Duplicate customer_id and order_id" });
          } else {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
          }
        } else {
          res.status(201).json({ message: "Delivery created successfully" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.IndexDeleteController = (req, res) => {
  try {
    dbConfig.query(
      "DELETE FROM `delivery` WHERE `id` = ?",
      [req.params.id],
      (err, result) => {
        if (err) throw err;
        res.status(200).json({ data: result });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.IndexUpdateController = (req, res) => {
  try {
    dbConfig.query(
      "UPDATE `delivery` SET ? WHERE id = ?",
      [req.body, req.params.id],
      (err, result) => {
        if (err) throw err;
        res.status(200).json({ data: result });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
