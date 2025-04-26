import Image from "../schemas/Image";

export const imageSave = async (image: Express.Multer.File) => {
  const name = Date.now() + image.originalname;
  const newImage = new Image({
    name,
    img: {
      data: image.buffer,
      contentType: image.mimetype,
    },
  });
  await newImage.save();
  return name;
};

export const imageDelete = async (name: string) => {
  const image = await Image.findOne({ name });
  if (!image) {
    return;
  }
  await image.deleteOne();
};
