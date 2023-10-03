const dbConfig = require("../lib/db");

//Save delivery data
exports.IndexPostController = (req, res) => {
  req.body.driver_skill = Math.floor(Math.random() * 100) + 1;
  req.body.traffic_condition = Math.floor(Math.random() * 100) + 1;
  const {
    sender_name,
    sender_type,
    mobile_number,
    item_type,
    num_pics,
    order_date,
    preferred_date,
    receiver_name,
    address,
    pre,
    province,
    receiver_email,
    receiver_mobile,
    driver_skill,
    traffic_condition,
  } = req.body;
  if (pre > 7) {
    req.body.driver_skill = Math.floor(req.body.driver_skill / 3);
    req.body.traffic_condition = Math.floor(req.body.traffic_condition / 3);
  }

  let marks = 0;
  if (req.body.driver_skill) {
    marks += parseInt(req.body.driver_skill);
  }

  if (req.body.traffic_condition) {
    marks += parseInt(req.body.traffic_condition);
  }

  if (receiver_name && receiver_email && receiver_mobile) {
    marks += 100;
  }

  const insertQuery = `
      INSERT INTO order_details (
        sender_name,
        sender_type,
        mobile_number,
        item_type,
        num_pics,
        order_date,
        preferred_date,
        receiver_name,
        address,
        province,
        receiver_email,
        receiver_mobile,
        driver_skill,
        traffic_condition,
        pre_days,
        success
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

  const params = [
    sender_name,
    sender_type,
    mobile_number,
    item_type,
    num_pics,
    order_date,
    preferred_date,
    receiver_name,
    address,
    province,
    receiver_email,
    receiver_mobile,
    driver_skill,
    traffic_condition,
    pre,
    Math.floor(marks / 3),
  ];

  const checkMobileQuery =
    "SELECT COUNT(*) AS count FROM order_details WHERE mobile_number = ?";

  try {
    dbConfig.query(checkMobileQuery, [mobile_number], (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        const count = rows[0].count;

        if (count > 0) {
          res.status(400).json({ error: "Mobile number already exists" });
        } else {
          dbConfig.query(insertQuery, params, (err, result) => {
            if (err) {
              res.status(500).json({ error: "Internal server error" });
            } else {
              res.status(200).json({
                message: "Data inserted successfully",
                insertId: result.insertId,
              });
            }
          });
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while saving form data" });
  }
};

//Get all delivery data
exports.IndexController = (req, res) => {
  try {
    dbConfig.query("SELECT * FROM `order_details`", (err, result) => {
      if (err) throw err;
      res.status(200).json({ data: result });
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
};

//Delete selected dilivery
exports.IndexDeleteController = (req, res) => {
  dbConfig.query(
    "DELETE FROM `order_details` WHERE `id` = ?",
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({ data: result });
    }
  );
};
//GetAllcharn
exports.CharnController = (req, res) => {
  dbConfig.query("SELECT * FROM customer_charn", (err, result) => {
    if (err) throw err;
    res.status(200).json({ data: result });
  });
};

exports.CharnByIdController = (req, res) => {
  const charnId = req.params.id;
  dbConfig.query(
    "SELECT * FROM customer_charn WHERE id = ?",
    [charnId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.length === 0) {
          res.status(200).json({ error: result });
        } else {
          res.status(200).json({ data: result });
        }
      }
    }
  );
};

exports.IndexUpdateController = (req, res) => {
  dbConfig.query(
    "UPDATE `order_details` SET ? WHERE id = ?",
    [req.body, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({ data: result });
    }
  );
};

exports.IndexGetByIdController = (req, res) => {
  dbConfig.query(
    "SELECT * FROM `order_details` WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({ data: result });
    }
  );
};

exports.IndexUpdateSuccessPred = (req, res) => {
  const { id, driver_skill, traffic_condition, success } = req.body;

  const updateQuery =
    "UPDATE order_details SET driver_skill = ?, traffic_condition = ?, success = ? WHERE id = ?";

  dbConfig.query(
    updateQuery,
    [driver_skill, traffic_condition, success, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error updating data" });
      } else {
        res.json({ message: "Data updated successfully" });
      }
    }
  );
};
