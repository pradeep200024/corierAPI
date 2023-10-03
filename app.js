const express = require("express");
const cors = require("cors");
const deliveryRoutes = require("./routes/delivery");
const orderRoutes = require("./routes/order");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/delivery", deliveryRoutes);
app.use("/order", orderRoutes);

app.listen(3001, () => {

});
