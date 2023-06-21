import * as fs from 'fs';
import sharp from 'sharp';

export function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

export function getQueryStringObj(url: string): any {

	const datas = url.split('?').pop().split('&')

	const queries: any = datas.map(data => {
		const [key, value] = data.split('=')
		return value !== undefined ? { key, value } : null
	})
		.filter(v => v)
		.reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {})

	return queries

}

export function deepCopy<T>(objSend: T): T {

	if (null == objSend || typeof objSend !== 'object') {
		return objSend;
	}

	return JSON.parse(JSON.stringify(objSend));

}

export function shallowCopy<T>(objSend: T): T {

	if (null == objSend || 'object' !== typeof objSend) {
		return objSend
	}

	const copy = objSend.constructor()
	for (const attr in objSend) {
		if (objSend.hasOwnProperty(attr)) {
			copy[attr] = objSend[attr]
		}
	}
	return copy

}

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

export async function writeFile(path: string, base64Data: string, oldPath?: string) {

	return new Promise(async (resolve, reject) => {

		if (base64Data.indexOf(',') !== -1) {
			base64Data = base64Data.split(',')[1];
		}

		await new Promise(resolve2 => {

			let pathDir: any = path.includes('/') ? path.split('/') : path.split('\\');
			pathDir.pop();
			pathDir = pathDir.join('/');

			if (!fs.existsSync(pathDir)) {
				fs.mkdirSync(pathDir, { recursive: true });
			}

			fs.writeFile(path, base64Data, 'base64', async errSv => {
				if (errSv) {
					console.error(errSv);
					reject({ message: 'Problemas para salvar arquivo.', status: 'write' }); // gravar arquivo
				}
				resolve2(true);
			});

		});

		if (oldPath && oldPath !== path) {

			deleteFile(oldPath).catch(err => reject(err))

		}

		resolve(true);

	});

}

export async function deleteFile(path) {

	return new Promise((resolve, reject) => {
		fs.unlink(path, async errUn => {
			if (errUn) {
				console.error(errUn);
				reject({ message: 'Problemas para apagar arquivo.', status: 'unlink' }); // apagar arquivo antigo
			}
			resolve(true);
		});
	});

}
export interface GenericObj<T> extends Iterable<readonly [PropertyKey, any]> {
	[property: string | number]: T
}

export function objForEach<T>(obj: GenericObj<T>, callback: (item: T, key: string | number, index: number) => void) {
	// Object.fromEntries(obj).forEach(arr => callback(arr[1], arr[0]))
	Object.entries(obj).forEach(([key, value], index) => {
		callback(value, key, index)
	})
}

export async function asyncForEach<T>(array: T[], callback: (item: T, key: number, array: T[]) => void) {
	for (const k of array.keys()) { await callback(array[k], k, array) }
}

export async function parallelForEach<T>(array: T[], callback: (item: T, key: number, array: T[]) => void) {
	await Promise.all(array.map((v, k) => callback(v, k, array)));
}

export function capitallize(text: string, allWords = false, onlyFirstLetter = false): string {

	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

}

export function strToDate(data: string, hour?: string): Date {

	let expDate: string[];
	if (data.indexOf('/') !== -1) {
		expDate = data.split('/');
	} else {
		expDate = data.split('-');
	}

	const expHour: string[] = (hour ? hour : '00:00:00').split(':');

	let ano, dia;

	if (expDate[2].length === 4) {
		ano = expDate[2];
		dia = expDate[0];
	} else {
		ano = expDate[0];
		dia = expDate[2];
	}

	return new Date(parseInt(ano, 10), parseInt(expDate[1], 10) - 1, parseInt(dia, 10),
		parseInt(expHour[0], 10), parseInt(expHour[1], 10), parseInt(expHour[2] ? expHour[2] : '00', 10));

}

export function dateToStr(date: Date | string, dbStyle = false, dateOnly = true, viaLocale = false) {

	if (typeof date === 'string') {
		date = strToDate(date)
	}

	if (viaLocale) {

		let dateOptions: any

		if (dateOnly) {
			dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }
		} else {
			dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
		}

		return date.toLocaleDateString('pt-br', dateOptions)

	} else {


		let str = '';

		if (dbStyle) {

			str = date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' +
				date.getDate().toString().padStart(2, '0');

			if (!dateOnly) {
				str += ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
			}

		} else {

			str = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1 + '').padStart(2, '0') + '/' +
				date.getFullYear();

			if (!dateOnly) {
				str += ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
			}
		}

		return str;

	}

}

export function timeDiff(tempoMenor: Date | string, tempoMaior: Date | string = new Date(), short = true) {
	if (typeof tempoMenor === 'string') {

		const data = tempoMenor.split(' ')[0].split('-');
		const hora = tempoMenor.split(' ')[1].split(':');

		tempoMenor = new Date();
		tempoMenor.setFullYear(parseInt(data[0], 10));
		tempoMenor.setMonth(parseInt(data[1], 10));
		tempoMenor.setDate(parseInt(data[2], 10));
		tempoMenor.setHours(parseInt(hora[0], 10));
		tempoMenor.setMinutes(parseInt(hora[1], 10));
		tempoMenor.setSeconds(parseInt(hora[2], 10));
	}

	if (typeof tempoMaior === 'string') {

		const data = tempoMaior.split(' ')[0].split('-');
		const hora = tempoMaior.split(' ')[1].split(':');

		tempoMaior = new Date();
		tempoMaior.setFullYear(parseInt(data[0], 10));
		tempoMaior.setMonth(parseInt(data[1], 10));
		tempoMaior.setDate(parseInt(data[2], 10));
		tempoMaior.setHours(parseInt(hora[0], 10));
		tempoMaior.setMinutes(parseInt(hora[1], 10));
		tempoMaior.setSeconds(parseInt(hora[2], 10));
	}

	const strArr: string[] = [];

	const diferenca = Math.floor((tempoMaior.getTime() - tempoMenor.getTime()) / 1000);

	const dias = Math.floor(diferenca / 3600 / 24);
	const horas = Math.floor(diferenca / 3600) - dias * 24;
	const minutos = Math.floor(diferenca / 60) - (horas + dias * 24) * 60;
	const segundos = diferenca - (minutos + ((horas + (dias * 24)) * 60)) * 60;

	return { dias, horas, minutos, segundos };
}

export function timeDiffToStr(tempoMenor: Date | string, tempoMaior: Date | string = new Date(), short = true) {

	if (typeof tempoMenor === 'string') {

		const data = tempoMenor.split(' ')[0].split('-');
		const hora = tempoMenor.split(' ')[1].split(':');

		tempoMenor = new Date();
		tempoMenor.setFullYear(parseInt(data[0], 10));
		tempoMenor.setMonth(parseInt(data[1], 10));
		tempoMenor.setDate(parseInt(data[2], 10));
		tempoMenor.setHours(parseInt(hora[0], 10));
		tempoMenor.setMinutes(parseInt(hora[1], 10));
		tempoMenor.setSeconds(parseInt(hora[2], 10));
	}

	if (typeof tempoMaior === 'string') {

		const data = tempoMaior.split(' ')[0].split('-');
		const hora = tempoMaior.split(' ')[1].split(':');

		tempoMaior = new Date();
		tempoMaior.setFullYear(parseInt(data[0], 10));
		tempoMaior.setMonth(parseInt(data[1], 10));
		tempoMaior.setDate(parseInt(data[2], 10));
		tempoMaior.setHours(parseInt(hora[0], 10));
		tempoMaior.setMinutes(parseInt(hora[1], 10));
		tempoMaior.setSeconds(parseInt(hora[2], 10));
	}

	const strArr: string[] = [];
	let str = '';

	const diferenca = Math.floor((tempoMaior.getTime() - tempoMenor.getTime()) / 1000);

	const dias = Math.floor(diferenca / 3600 / 24);
	const horas = Math.floor(diferenca / 3600) - dias * 24;
	const minutos = Math.floor(diferenca / 60) - (horas + dias * 24) * 60;
	const segundos = diferenca - (minutos + ((horas + (dias * 24)) * 60)) * 60;

	if (dias >= 1) {
		strArr.push(dias + ' ' + ((dias !== 1) ? 'dias' : 'dia'));
	}
	if (horas >= 1 || dias >= 1) {
		strArr.push(horas + ' ' + ((horas !== 1) ? 'horas' : 'hora'));
	}
	if (minutos >= 1 || horas >= 1 || dias >= 1) {
		strArr.push(minutos + ' ' + ((minutos !== 1) ? 'minutos' : 'minuto'));
	}
	strArr.push(segundos + ' ' + ((segundos !== 1) ? 'segundos' : 'segundo'));

	if (strArr.length > 1) {
		const last: string = strArr.pop();
		str = strArr.join(', ') + ' e ' + last;
	} else {
		str = strArr.join(', ');
	}

	if (short) {
		str = str.split(', ')[0].split(' e ')[0];
	}

	return str;

}

export function distancia(lat1: number, long1: number, lat2: number, long2: number): number {

	const d2r = 0.017453292519943295769236;

	const dlong = (long2 - long1) * d2r;
	const dlat = (lat2 - lat1) * d2r;

	const tempSin = Math.sin(dlat / 2);
	const tempCos = Math.cos(lat1 * d2r);
	const tempSin2 = Math.sin(dlong / 2);

	const a = (tempSin * tempSin) + (tempCos * tempCos) * (tempSin2 * tempSin2);
	const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));

	return 6568.1 * c;

	// return 6368.1 * c;

}

export function nl2br(txt) {

	if (!txt) {
		return '';
	}

	while (txt.includes('\n')) {
		txt = txt.replace('\n', '<br />');
	}

	return txt;

}

export function htmlEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function dinheiro(value: string, rs: boolean): number
export function dinheiro(value: number, rs: boolean): string
export function dinheiro(value: string | number, rs = true): string | number {

	if (typeof value === 'string') {

		value = value.replace('.', '').replace('.', '').replace('.', '').replace(',', '.');

		return parseFloat(value ? value : '0');
	}

	let x = 0;
	if (value < 0) {
		value = Math.abs(value);
		x = 1;
	}
	let valueTxt: string;
	if (isNaN(value)) {
		value = 0;
	}
	let cents: any = Math.floor((value * 100 + 0.5) % 100);
	valueTxt = Math.floor((value * 100 + 0.5) / 100).toString();

	if (cents < 10) {
		cents = '0' + cents;
	}
	for (let i = 0; i < Math.floor((valueTxt.length - (1 + i)) / 3); i++) {
		valueTxt = valueTxt.substring(0, valueTxt.length - (4 * i + 3)) + '.' + valueTxt.substring(valueTxt.length - (4 * i + 3));
	}
	let ret = valueTxt + ',' + cents;
	if (x === 1) {
		ret = ' - ' + ret;
	}

	return (rs ? 'R$ ' : '') + ret;
}

export const floatRoundFloor = (valor: number, precisao: number) => {
	return +valor.toFixed(10).substr(0, valor.toFixed(10).indexOf('.') + precisao + 1)
}

export function syntaxHighlight(json) {
	if (typeof json != 'string') {
		json = JSON.stringify(json, undefined, 2);
	}
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		let cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	})
}