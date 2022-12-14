import fs from 'fs';
import config from '../config.js';
import { messageDefaultContenedor } from '../helpers/statusMessage.js';//BORRAR

export default class Contenedor {
    constructor(fileName) {
        this.path = config.fileSystem.baseUrl;
        this._file = `${fileName}.txt`;
        this.url = `${this.path}${this._file}`
        this.status = messageDefaultContenedor;
    }

    // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    async save(object){
        try {
            let res = await fs.promises.readFile(`${this.url}`, 'utf-8');
            let content = JSON.parse(res);
            let newId = parseInt(content[content.length - 1].id) + 1
            const newElement = {
                id: String(newId),
                ...object
            }
            content.push(newElement);
            try {
                await fs.promises.writeFile(`${this.url}`,JSON.stringify(content,null,2))
                return { status: 'Success', message: this.status.save.success.message, id: newElement.id }
            }catch(err) {
                return { status: 'Error', message: this.status.save.error.message, error: err}
            }
        }catch(err) {
            const newElement = [
                {
                    id: "1",
                    ...object
                }
            ]
            try {
                await fs.promises.writeFile(`${this.url}`, JSON.stringify(newElement,null,2))
                return { status: 'Success', message: this.status.save.success.message, id: newElement[0].id}
            } catch (err) {
                return { status: 'Error', message: this.status.save.error.message, error: err}
            }
        }
    }

    // Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(id) {
        try{
            let res = await fs.promises.readFile(`${this.url}`,'utf-8');
            let content = JSON.parse(res);
            let findElement = content.find(el => el.id === id) 
            if (!findElement) {
                throw new Error()
            }
            return { status: 'Success', message: this.status.getById.success.message, payload: findElement}
        }catch(err){
            return { status: 'Error', message: this.status.getById.error.message, error: err}
        }
    }

    // Recibe un id de contenido y lo reemplaza por uno nuevo.
    async update(id, object) {
        try {
            let res = await fs.promises.readFile(`${this.url}`, 'utf-8');
            let content = JSON.parse(res);
            let findElement = content.find(el => el.id === id)
            if (!findElement) {
                throw new Error()
            }
            let updateElement = content.map(item=> {
                if (item.id === id) {
                    const pushElement = {
                        id: item.id,
                        code: item.code,
                        ...object
                    }
                    return pushElement
                } else {
                    return item
                }
            })
            try {
                await fs.promises.writeFile(`${this.url}`, JSON.stringify(updateElement, null, 2))
                return { status: 'Success', message: this.status.update.success.message}
            } catch (err) {
                return { status: 'Error', message: this.status.update.error.message, error: err }
            }
        } catch (err) {
            return { status: 'Error', message: this.status.getById.error.message, error: err }
        }
    }

    // Devuelve un array con los objetos presentes en el archivo.
    async getAll() {
        try{
            let res = await fs.promises.readFile(`${this.url}`,'utf-8');
            let content = JSON.parse(res);
            return {status: 'Success', message: this.status.getAll.success.message, payload: content}
        }catch(err){
            return { status: 'Error', message: this.status.getAll.error.message}
        }
    }

    // Elimina del archivo el objeto con el id buscado.
    async deleteById(id) {
        try{
            let res = await fs.promises.readFile(`${this.url}`,'utf-8');
            let content = JSON.parse(res);
            let findElement = content.find(el=>el.id === id)
            if(!findElement){
                throw new Error();
            }
            let excludedElement = content.filter(el=>el.id !== id);
            try {
                await fs.promises.writeFile(`${this.url}`, JSON.stringify(excludedElement,null,2))
                return { status: 'Success', message: this.status.deleteById.success.message}
            }catch(err){
                return { status: 'Error', message: this.status.deleteById.error.message}
            } 
        }catch(err){
            return { status: 'Error', message: this.status.getById.error.message}
        }
    }

    // Elimina todos los objetos presentes en el archivo..
    async deleteAll() {
        try{
            await fs.promises.unlink(`${this.url}`);
            return { status: 'Success', message: this.status.deleteAll.success.message}
        }catch(err){
            return { status: 'Error', message: this.status.deleteAll.error.message, error: err}
        }
    }
}