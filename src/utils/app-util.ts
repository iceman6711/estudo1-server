
import sharp from 'sharp'

export async function resizeImage(image: string, width: number, height: number) {
	try {

		if (!image) {
			return image
		}

		let imgBuffer

		if (image.includes(';base64')) {
			const img = image.toString().split(';base64,').pop()
			imgBuffer = Buffer.from(img, 'base64');
		}
		else {
			imgBuffer = image
		}

		imgBuffer = await sharp(imgBuffer)
			.resize({
				width: width,
				height: height,
				fit: 'inside'
			})
			.toFormat('jpeg', { mozjpeg: true })
			.withMetadata()
			.toBuffer()

		return imgBuffer.toString('base64')

	} catch (error) {
		console.log(error);
	}

	return image
}

export function removeTime(date = new Date()) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);
}

export function uniqueIdGen(baseId: number): string {

	return (100000000 + baseId).toString(16)
}

export function uniqueIdToId(uniqueId: string): number {

	return (parseInt(uniqueId, 16) - 100000000)

}