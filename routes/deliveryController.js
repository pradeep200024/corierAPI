const dbConfig = require("../lib/db");

//Save delivery data
exports.IndexPostController = (req, res) => {
  req.body.driver_skill = Math.floor(Math.random() * 100) + 1;
  req.body.traffic_condition = Math.floor(Math.random() * 100) + 1;
  const customer_password =
    "$2a$10$Pe/16ODxgmwLwFmgR7GYBOUYs3B9wPrGwHlA3GhWpRmWAoRrERvdq";
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
    sender_province,
    sender_email,
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

  const insertQuery = `INSERT INTO order_details( sender_name, sender_email, sender_type, sender_province, mobile_number, item_type, num_pics, order_date, preferred_date, receiver_name, address, province, receiver_email, receiver_mobile, driver_skill, traffic_condition, success, pre_days) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const params = [
    sender_name,
    sender_email,
    sender_type,
    sender_province,
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

    Math.floor(marks / 3),
    pre,
  ];

  const inserIntoCustomer = `INSERT INTO customers (email, password, name, type, mobile, no_of_pices, province, date) VALUES (?,?,?,?,?,?,?,?)`;
  const customerParams = [
    sender_email,
    customer_password,
    sender_name,
    sender_type,
    mobile_number,
    num_pics,
    sender_province,
    order_date,
  ];

  const insertIntoRecepients = `INSERT INTO recepients (name,email,phone,address,province,customer_contact) VALUES(?,?,?,?,?,?)`;
  const recepientParams = [
    receiver_name,
    receiver_email,
    receiver_mobile,
    address,
    province,
    mobile_number,
  ];

  const checkMobileQuery =
    "SELECT COUNT(*) AS count FROM order_details WHERE mobile_number = ?";

  try {
    dbConfig.query(checkMobileQuery, [mobile_number], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal server error checkMobileQuery" });
      } else {
        const count = rows[0].count;

        if (count > 0) {
          return res
            .status(200)
            .json({ message: "Mobile number already exists" });
        } else {
          // Save order_detail table
          dbConfig.query(insertQuery, params, (err, result) => {
            if (err) {
              return res.status(500).json({
                error: "Internal server error Save order_detail table",
              });
            } else {
              // Save customer table
              dbConfig.query(
                inserIntoCustomer,
                customerParams,
                (err, customerResult) => {
                  if (err) {
                    return res.status(500).json({
                      error: "Internal server error Save customer tabl",
                    });
                  } else {
                    // Save recipient details

                    dbConfig.query(
                      insertIntoRecepients,
                      recepientParams,
                      (err, recepientResult) => {
                        if (err) {
                          return res.status(500).json({
                            error:
                              "Internal server error Save recipient details",
                          });
                        } else {
                          return res.status(200).json({
                            message: "Data inserted successfully",
                            orderInsertId: result.insertId,
                            customerInsertId: customerResult.insertId,
                            recepientInsertId: recepientResult.insertId,
                          });
                        }
                      }
                    );
                  }
                }
              );
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
    "DELETE FROM `order_details` WHERE `mobile_number` = ?",
    [req.params.mobileNo],
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

//Update

exports.IndexUpdateController = (req, res) => {
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
    sender_province,
    sender_email,
  } = req.body;

  const updateCustomers = `UPDATE customers 
                          SET email=?, type=?, name=?, mobile=?, no_of_pices=?, province=?, date=? 
                          WHERE mobile=?`;
  const updateCustomerParams = [
    sender_email,
    sender_type,
    sender_name,
    mobile_number,
    num_pics,
    sender_province,
    order_date,
    mobile_number,
  ];

  const updateRecepient = `UPDATE recepients 
                          SET name=?, email=?, phone=?, address=?, province=? 
                          WHERE customer_contact=?`;
  const recepientParams = [
    receiver_name,
    receiver_email,
    receiver_mobile,
    address,
    province,
    mobile_number,
  ];

  // Update the customers table
  dbConfig.query(
    updateCustomers,
    updateCustomerParams,
    (err, customerResult) => {
      if (err) {
        res.status(500).json({ error: "Error updating customers table" });
      } else {
        // Update the recepients table
        dbConfig.query(
          updateRecepient,
          recepientParams,
          (err, recepientResult) => {
            if (err) {
              res
                .status(500)
                .json({ error: "Error updating recepients table" });
            } else {
              // Update the order_details table
              dbConfig.query(
                "UPDATE `order_details` SET ? WHERE mobile_number = ?",
                [req.body, req.params.mobileNo],
                (err, result) => {
                  if (err) {
                    res
                      .status(500)
                      .json({ error: "Error updating order_details table" });
                  } else {
                    res.status(200).json({ message: "Update successful" });
                  }
                }
              );
            }
          }
        );
      }
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
