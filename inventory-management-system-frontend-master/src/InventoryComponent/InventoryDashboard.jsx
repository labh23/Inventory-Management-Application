import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import revenue_pic from "../images/revenue.png";
import profit_pic from "../images/profit.png";
import customers_pic from "../images/users.png";
import categories_pic from "../images/categories.png";
import products_pic from "../images/products.png";
import todays_orders_pic from "../images/todays_orders.png";
import total_orders_pic from "../images/total_orders.png";
import quantities_pic from "../images/quantities.png";
import * as XLSX from "xlsx";
import Footer from "../pages/Footer";

const InventoryDashboard = () => {
  const [data, setData] = useState({
    top5HighestSoldProducts: [],
    top5HighestProfitProducts: [],
    totalOrders: [],
  });

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [tempStartTime, setTempStartTime] = useState("");
  const [tempEndTime, setTempEndTime] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const getInventoryData = async () => {
      if (startTime !== "" && endTime !== "") {
        const inventoryData = await retrieveInventoryDataByTimeRange();
        if (inventoryData) {
          setData(inventoryData);
        }
      } else {
        const inventoryData = await retrieveInventoryData();
        if (inventoryData) {
          setData(inventoryData);
        }
      }
    };

    getInventoryData();
  }, [startTime, endTime]);

  const retrieveInventoryData = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/inventory/dashboard"
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveInventoryDataByTimeRange = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/inventory/data/time-range?startTime=" +
        convertToEpochTime(startTime) +
        "&endTime=" +
        convertToEpochTime(endTime)
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const getInventoryDataUsingTimeRange = (e) => {
    e.preventDefault();

    if (tempStartTime === "" || tempEndTime === "") {
      alert("Please select Start Time and End Time");
    } else {
      setStartTime(tempStartTime);
      setEndTime(tempEndTime);
    }
  };

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  const getTodaysInventoryData = (e) => {
    e.preventDefault();

    setStartTime("");
    setEndTime("");
  };

  const downloadExcel = (orders) => {
    if (!orders || orders <= 0) {
      alert("No Orders Found to Download Excel!!!");
    } else {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(
        orders.map((order) => ({
          "Order Id": order.orderId,
          "Order Time": formatDateFromEpoch(order.orderDate),
          "Customer Name": order.user.firstName + " " + order.user.lastName,
          "Customer Email": order.user.emailId,
          "Customer Mobile No": order.user.phoneNo,
          Product: order.product.title,
          Quantity: order.quantity,
          "Supplied Quantity": order.product.suppliedQuantity,
          "Supplier Name":
            order.product.supplier.firstName +
            " " +
            order.product.supplier.lastName,
          "Purchase Price": order.product.purchasePrice,
          "Selling Price": order.product.price,

          "Total Price": order.quantity * order.product.price,
          "Profit / Loss":
            order.quantity * order.product.price -
            order.quantity * order.product.purchasePrice,
        }))
      );

      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(wb, "orders.xlsx");
    }
  };

  return (
    <div className="container-fluid mt-3 mb-5">
      <div className="container">
        <div className="d-flex aligns-items-center justify-content-center mt-5">
          <form class="row g-3">
            <div class="col-auto">
              <input
                type="datetime-local"
                class="form-control"
                onChange={(e) => setTempStartTime(e.target.value)}
                value={tempStartTime}
                required
              />
            </div>

            <div class="col-auto">
              <input
                type="datetime-local"
                class="form-control"
                onChange={(e) => setTempEndTime(e.target.value)}
                value={tempEndTime}
                required
              />
            </div>
            <div class="col-auto">
              <button
                type="submit"
                class="btn bg-color custom-bg-text mb-3"
                onClick={getInventoryDataUsingTimeRange}
              >
                Get Inventory Data
              </button>
            </div>
          </form>
          <button
            type="submit"
            class="btn bg-color custom-bg-text ms-3 mb-3"
            onClick={getTodaysInventoryData}
          >
            Get Todays Inventory Data
          </button>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={revenue_pic}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "65px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8377; {data.totalSale}/-</h3>
                    <div className="text-muted">Todays Sale</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={profit_pic}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "65px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3> &#8377; {data.totalProfit}/-</h3>
                    <div className="text-muted">Todays Profit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={total_orders_pic}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "65px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3>{data.totalTodaysOrdersCount}</h3>
                    <div className="text-muted">Todays Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={quantities_pic}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "62px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalProductsSold}</h3>
                    <div className="text-muted">Sold Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(() => {
          if (startTime === "" && endTime === "") {
            return (
              <div className="row mt-3">
                <div className="col">
                  <div className="card rounded-card shadow-lg">
                    <div className="card-body">
                      <div className="row">
                        <div className="col ">
                          <img
                            src={customers_pic}
                            class="card-img-top rounded"
                            alt="img"
                            style={{
                              width: "65px",
                            }}
                          />
                        </div>
                        <div className="col" style={{ whiteSpace: "nowrap" }}>
                          <h3> {data.totalCustomerCount}</h3>
                          <div className="text-muted">Total Customers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card rounded-card shadow-lg">
                    <div className="card-body">
                      <div className="row">
                        <div className="col ">
                          <img
                            src={categories_pic}
                            class="card-img-top rounded"
                            alt="img"
                            style={{
                              width: "65px",
                            }}
                          />
                        </div>
                        <div className="col" style={{ whiteSpace: "nowrap" }}>
                          <h3> {data.totalCategoryCount}</h3>
                          <div className="text-muted">Total Category</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card rounded-card shadow-lg">
                    <div className="card-body">
                      <div className="row">
                        <div className="col ">
                          <img
                            src={products_pic}
                            class="card-img-top rounded"
                            alt="img"
                            style={{
                              width: "65px",
                            }}
                          />
                        </div>
                        <div className="col" style={{ whiteSpace: "nowrap" }}>
                          <h3> {data.totalProductCount}</h3>
                          <div className="text-muted">Total Products</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card rounded-card shadow-lg">
                    <div className="card-body">
                      <div className="row">
                        <div className="col ">
                          <img
                            src={todays_orders_pic}
                            class="card-img-top rounded"
                            alt="img"
                            style={{
                              width: "65px",
                            }}
                          />
                        </div>
                        <div className="col" style={{ whiteSpace: "nowrap" }}>
                          <h3>{data.totalOrderCount}</h3>
                          <div className="text-muted">Total Orders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()}

        <div className="row mt-3">
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="text-center">
                  <h4>Top 5 Highest Sold Products</h4>
                </div>
                <div
                  style={{
                    overflowY: "auto",
                  }}
                >
                  <div className="table-responsive">
                    <table className="table table-hover text-color text-center">
                      <thead className="table-bordered border-color bg-color custom-bg-text">
                        <tr>
                          <th scope="col">Product</th>
                          <th scope="col">Category</th>
                          <th scope="col">Sold Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top5HighestSoldProducts.map((soldProduct) => {
                          return (
                            <tr>
                              <td>
                                <b>{soldProduct.product.title}</b>
                              </td>
                              <td>
                                <b>{soldProduct.product.category.title}</b>
                              </td>
                              <td>
                                <b>{soldProduct.totalSold}</b>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="text-center">
                  <h4>Top 5 Highest Profitable Products</h4>
                </div>
                <div
                  style={{
                    overflowY: "auto",
                  }}
                >
                  <div className="table-responsive">
                    <table className="table table-hover text-color text-center">
                      <thead className="table-bordered border-color bg-color custom-bg-text">
                        <tr>
                          <th scope="col">Product</th>
                          <th scope="col">Category</th>
                          <th scope="col">Profit (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top5HighestProfitProducts.map((soldProduct) => {
                          return (
                            <tr>
                              <td>
                                <b>{soldProduct.product.title}</b>
                              </td>
                              <td>
                                <b>{soldProduct.product.category.title}</b>
                              </td>
                              <td>
                                <b>{soldProduct.totalProfit}</b>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3 mb-5">
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="text-center">
                  <h4>Total Customer Orders</h4>
                </div>
                <div
                  style={{
                    overflowY: "auto",
                    height: "300px",
                  }}
                >
                  <div className="table-responsive">
                    <table className="table table-hover text-color text-center">
                      <thead className="table-bordered border-color bg-color custom-bg-text">
                        <tr>
                          <th scope="col">Order Id</th>
                          <th scope="col">Order Time</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Product</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Purchase Price</th>
                          <th scope="col">Selling Price</th>
                          <th scope="col">Profit / Loss</th>
                          <th scope="col">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.totalOrders.map((order) => {
                          return (
                            <tr>
                              <td>
                                <b>{order.orderId}</b>
                              </td>
                              <td>
                                <b>{formatDateFromEpoch(order.orderDate)}</b>
                              </td>
                              <td>
                                <b>{order.user.firstName}</b>
                              </td>
                              <td>
                                <b>{order.product.title}</b>
                              </td>
                              <td>
                                <b>{order.quantity}</b>
                              </td>
                              <td>
                                <b>&#8377;{order.product.purchasePrice}</b>
                              </td>
                              <td>
                                <b>&#8377;{order.product.price}</b>
                              </td>
                              <td>
                                <b>
                                  &#8377;
                                  {order.quantity * order.product.price -
                                    order.quantity *
                                      order.product.purchasePrice}
                                </b>
                              </td>
                              <td>
                                <b>
                                  &#8377;{order.quantity * order.product.price}
                                </b>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="d-flex justify-content-center">
                      <button
                        onClick={(e) => downloadExcel(data.totalOrders)}
                        className="btn btn-sm bg-color custom-bg-text ms-2"
                      >
                        <b> Download Report</b>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InventoryDashboard;
