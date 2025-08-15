require("dotenv").config();
const { Worker } = require("bullmq");
const { connection, imageQueue } = require("../queues");
const Request = require("../../db/models/Request");
const Image = require("../../db/models/Image");
const csvGenerator = require("../../services/csvGenerator.service");
const webhook = require("../../services/webhook.service");

new Worker(
  "requestQueue",
  async (job) => {
    const { requestId } = job.data;
    await Request.updateOne({ requestId }, { status: "PROCESSING" });

    const images = await Image.find({ requestId }).lean();
    await Promise.all(
      images.map((img) =>
        imageQueue.add("processImage", { imageId: String(img._id), requestId })
      )
    );
  },
  { connection }
);
