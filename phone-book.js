'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

function containsPhone(phone) {
    return phoneBook.find(contact => contact.phone === phone);
}

function checkParameters(phone, name) {
    return !/^(\d){10}$/.test(phone) || typeof name !== 'string' ||
        typeof phone !== 'string' || name.length === 0;
}

function toNewFormatPhone(phone) {
    return `+7 (${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 8)}` +
        `-${phone.substring(8)}`;
}

function toFormat(phone, name, email) {
    if (typeof email === 'undefined') {
        return `${phone} ${name}`;
    }

    return `${phone} ${name} ${email}`;
}

function toDefaultFormat(phone) {
    return phone.substring(4).match(/\d/g)
        .join('');
}

function returnAllBook(sortBook) {
    const res = [];

    for (let i = 0; i < sortBook.length; i++) {
        const newPhone = toNewFormatPhone(sortBook[i].phone);

        if (typeof sortBook[i].email === 'undefined') {
            res.push(`${sortBook[i].name}, ${newPhone}`);
        } else {
            res.push(`${sortBook[i].name}, ${newPhone}, ${sortBook[i].email}`);
        }
    }

    return res;
}

function findElement(query, sortBook) {
    const res = [];

    for (let i = 0; i < sortBook.length; i++) {
        const newPhone = toNewFormatPhone(sortBook[i].phone);
        const contact = toFormat(sortBook[i].phone, sortBook[i].name, sortBook[i].email);

        if (contact.indexOf(query) > -1 && typeof sortBook[i].email !== 'undefined') {
            res.push(`${sortBook[i].name}, ${newPhone}, ${sortBook[i].email}`);
        } else if (contact.indexOf(query) > -1) {
            res.push(`${sortBook[i].name}, ${newPhone}`);
        }
    }

    return res;
}

function sort() {
    const temp = phoneBook.slice();

    return temp.sort((contact, anotherContact) => contact.name > anotherContact.name);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkParameters(phone, name) || containsPhone(phone)) {
        return false;
    }

    if (typeof email === 'undefined') {
        phoneBook.push({ phone, name });
    } else {
        phoneBook.push({ phone, name, email });
    }

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (checkParameters(phone, name)) {
        return false;
    }

    for (let i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let sortBook = [];

    if (query === '' || typeof query !== 'string') {
        return sortBook;
    }

    sortBook = sort();

    if (query === '*') {
        return returnAllBook(sortBook);
    }

    return findElement(query, sortBook);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof query !== 'string' || query === '') {
        return 0;
    }

    const contacts = find(query);

    for (let i = 0; i < contacts.length; i++) {
        const phone = toDefaultFormat(contacts[i].split(', ')[1]);
        const index = phoneBook.findIndex(contact => contact.phone === phone);

        if (index > -1) {
            phoneBook.splice(index, 1);
        }
    }

    return contacts.length;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    if (typeof csv !== 'string') {
        return 0;
    }

    const contact = csv.replace(/;/g, ' ').split('\n');
    let count = 0;

    for (let i = 0; i < contact.length; i++) {
        const temp = contact[i].split(' ');
        const data = {
            phone: temp[1],
            name: temp[0],
            email: temp[2]
        };

        if (add(data.phone, data.name, data.email) ||
            update(data.phone, data.name, data.email)) {
            count++;
        }
    }

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
