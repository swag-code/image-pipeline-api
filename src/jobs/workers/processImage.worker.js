require("dotenv").config();
const { Worker } = require("bullmq");
const { connection } = require("../queues");
const Image = require("../../db/models/Image");
const Request = require("../../db/models/Request");
const imageSvc = require("../../services/image.service");

new Worker(
  "imageQueue",
  async (job) => {
    const { imageId, requestId } = job.data;
    const img = await Image.findById(imageId);
    if (!img) return;

    try {
      const outputUrl = await imageSvc.downloadCompressStore({
        requestId,
        inputUrl: img.inputUrl,
        position: img.position,
      });
      await Image.updateOne({ _id: imageId }, { status: "DONE", outputUrl });
      await Request.updateOne({ requestId }, { $inc: { processedItems: 1 } });
    } catch (e) {
      await Image.updateOne(
        { _id: imageId },
        { status: "FAILED", error: String(e) }
      );
      await Request.updateOne({ requestId }, { $inc: { failedItems: 1 } });
    }
  },
  { connection }
);
