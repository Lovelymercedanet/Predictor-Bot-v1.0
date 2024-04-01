const TelegramBot = require('node-telegram-bot-api');

const path = require('path');
const token = '6805140082:AAEn9cnhWDN27MuICHriiKJnaRxnhHRjx9I';
// Токен от Бота Ильи 6805140082:AAEn9cnhWDN27MuICHriiKJnaRxnhHRjx9I
// Токен дле тест бота 6948231596:AAF_Mv-hgIYFSIj63Rl3K41ltjEARf6S8IU
const bot = new TelegramBot(token, { polling: true });


const commands = `Актуальные комманды\n\nИзменение пароля /changepassword <новый пароль>\n\nИзменение лички в формате "@" /changelichkatext <новая личка>\n\nИзменение лички в формате ссылки /changelichkalink <новая личка>\n\nДобавить администратора /addadmin <ID пользователя> (Только для владельца)\nЧтобы найти ID, нужно активировать бота в @getmyid_bot и взять число из строки 'Your user ID' (Нужен ID того, кому дают админку)\n\nУдалить администратора /deleteadmin <ID пользователя> (Только для владельца)\n\nПередать права владения ботом /changeowner (Только для владельца)\n\nПосмотреть список администраторов /adminlist`;
let owner = 6286624551;  // ID владельца
let correctPassword = '90002000';
let lichkatext = '@gemini_support1'; 
let lichkalink = 't.me/gemini_support1';
let adminsList = [];

bot.onText(/\/changepassword (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString(); // Получаем ID пользователя, отправившего сообщение, и конвертируем в строку
    const newPassword = match[1]; // Извлекаем новый пароль из сообщения

    if (owner === chatId || adminsList.includes(userId)) { // Проверяем, является ли отправитель владельцем или администратором
        // Присваиваем новое значение переменной correctPassword
        correctPassword = newPassword;

        // Отправляем сообщение об успешном изменении пароля
        bot.sendMessage(chatId, `Пароль успешно изменен на: ${correctPassword}`);
    } else {
        // Отправляем сообщение о недостаточных правах для изменения пароля
        bot.sendMessage(chatId, 'У вас нет разрешения на изменение пароля.');
    }
});
bot.onText(/\/changeowner (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (owner === chatId) { // Сравниваем с ID владельца в виде строки
        const newOwner = parseInt(match[1]); // Преобразуем строку в целое число
        owner = newOwner;
        bot.sendMessage(chatId, `Вы передали право владения ботом: ${owner}`);
    } else {
        bot.sendMessage(chatId, 'У вас нет разрешения на передачу прав');
    }
});
bot.on('message', (msg) => {
    if (msg.text === '/getcommands') {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, commands)
    }
});
bot.onText(/\/changelichkatext (.+)/, (msg, match) => {
    const userId = msg.chat.id
    const chatId = msg.chat.id.toString();
    const newLichkaText = match[1]; // Извлекаем новую личку из сообщения

    if (owner === userId || adminsList.includes(chatId)) { // Проверяем, является ли отправитель владельцем или администратором
        // Присваиваем новое значение переменной
        lichkatext = newLichkaText;

        // Отправляем сообщение об успешном изменении
        bot.sendMessage(chatId, `Личка в формате "@" успешно изменена на: ${lichkatext}`);
    } else {
        // Отправляем сообщение о недостаточных правах для изменения лички
        bot.sendMessage(chatId, 'У вас нет разрешения на изменение лички.');
    }
});
bot.onText(/\/changelichkalink (.+)/, (msg, match) => {
    const userId = msg.chat.id
    const chatId = msg.chat.id.toString();
    const newLichkaLink = match[1]; // Извлекаем новую личку из сообщения

    if (owner === userId || adminsList.includes(chatId)) { // Проверяем, является ли отправитель владельцем или администратором
        // Присваиваем новое значение переменной
        lichkalink = newLichkaLink;

        // Отправляем сообщение об успешном изменении
        bot.sendMessage(chatId, `Личка ссылкой успешно изменена на: ${lichkalink}`);
    } else {
        // Отправляем сообщение о недостаточных правах для изменения лички
        bot.sendMessage(chatId, 'У вас нет разрешения на изменение лички.');
    }
});
bot.onText(/\/addadmin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    if (owner === senderId) { // Проверка, является ли отправитель владельцем
        const newAdminId = match[1]; // Получение ID нового администратора из аргумента команды
        adminsList.push(newAdminId); // Добавление нового администратора в массив
        bot.sendMessage(chatId, `Администратор с ID ${newAdminId} добавлен.`);
    } else {
        bot.sendMessage(chatId, 'У вас нет разрешения на добавление администраторов.');
    }
});

bot.onText(/\/deleteadmin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (owner === chatId) { // Проверка, является ли отправитель владельцем
        const adminIdToDelete = match[1]; // Получение ID администратора для удаления из аргумента команды
        const index = adminsList.indexOf(adminIdToDelete); // Поиск индекса администратора в массиве
        if (index !== -1) { // Если администратор найден в массиве
            adminsList.splice(index, 1); // Удаление администратора из массива
            bot.sendMessage(chatId, `Администратор с ID ${adminIdToDelete} удален.`);
        } else {
            bot.sendMessage(chatId, `Администратор с ID ${adminIdToDelete} не найден.`);
        }
    } else {
        bot.sendMessage(chatId, 'У вас нет разрешения на удаление администраторов.');
    }
});
bot.onText(/\/adminlist/, (msg) => {
    const chatId = msg.chat.id;
    if (owner === chatId || adminsList.includes(chatId)) { // Проверка, является ли отправитель владельцем или администратором
        if (adminsList.length > 0) {
            const adminListMessage = `Список администраторов:\n${adminsList.join('\n')}`;
            bot.sendMessage(chatId, adminListMessage);
        } else {
            bot.sendMessage(chatId, 'Список администраторов пуст.');
        }
    } else {
        bot.sendMessage(chatId, 'У вас нет разрешения на просмотр списка администраторов.');
    }
});

// Чат ID канала Ильи -1001736748551
// Чат ID тестового канала -1002068538459
bot.on('chat_join_request', (msg) => {
    let chatId = '-1001736748551'
    let userId = msg.from.id;
    let username = msg.from.username
    bot.approveChatJoinRequest(chatId, userId)
        .catch((error) => {
            console.error(`Error accepting user: ${userId}`, error);
        });
    let approveChatJoinRequestMessage = `<b>Welcome to our winning team, ${username}! 👋🏼\nWant to start earning <u>30,000+RS</u> daily?</b>\n\nWrite to our support team <u><b>${lichkatext}</b></u> 📩\nAnd they will help you earn your first <b><u>10,000 RS</u> <u>today</u></b>!💰💰💰\n\nPress the button to activate this bot`;
    bot.sendMessage(userId, approveChatJoinRequestMessage, {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                [{ text: 'START▶️' }]
            ],
            resize_keyboard: true
        }
    });
});

bot.on('text', (msg) => {
    let text = msg.text;
    if (text === 'START▶️') {
        let chatId = msg.chat.id
        let text = `<b>With my bot you can earn and more than 10k a day!🔥</b>\nWe guarantee that this <u>is the minimum amount you can earn</u> ✅\n\nTo start working with our bot first of all write to support <b>${lichkatext}</b>📩, they will tell you how to earn and give you a special bonus in the form of <u>150% to deposit + 250 fs</u>🎁`
        let video = path.join(__dirname, 'video0.mp4');
        bot.sendVideo(chatId, video, {
            contentType: 'video/mp4',
            caption: text,
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Get 150% + 250 fs', url: `${lichkalink}` }, { text: 'Get the password', url: `${lichkalink}` }],
                    [{ text: '🏆Benefits of AVIATOR GEMINI🏆', callback_data: 'photoReviewThirdMessageButton' }],
                    [{ text: '✅Enter the password', callback_data: 'typeInPasswordButton' }]
                ]
            }
        }).catch((error) => {
            console.error('Error sending video:', error);
        });
    }
});

bot.on('message', (msg) => {
    let text = msg.text;
    if (text === '/start') {
        let chatId = msg.chat.id
        let text = `<b>With my bot you can earn and more than 10k a day!🔥</b>\nWe guarantee that this <u>is the minimum amount you can earn</u> ✅\n\nTo start working with our bot first of all write to support <b>${lichkatext}</b>📩, they will tell you how to earn and give you a special bonus in the form of <u>150% to deposit + 250 fs</u>🎁`
        let video = path.join(__dirname, 'video0.mp4');
        bot.sendVideo(chatId, video, {
            contentType: 'video/mp4',
            caption: text,
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Get 150% + 250 fs', url: `${lichkalink}` }, { text: 'Get the password', url: `${lichkalink}` }],
                    [{ text: '🏆Benefits of AVIATOR GEMINI🏆', callback_data: 'photoReviewThirdMessageButton' }],
                    [{ text: '✅Enter the password', callback_data: 'typeInPasswordButton' }]
                ]
            }
        }).catch((error) => {
            console.error('Error sending video:', error);
        });
    }
});




// bot.on('callback_query', (query) => {
//     if (query.data === 'secondMessageButton') {
//         const chatId = query.message.chat.id;
//         const videoSecondPost = path.join(__dirname, 'video1.mp4');
//         let text = `The benefits offered by my cutting-edge AI technology, GEMINI, encompass:\n\n<i>1. Daily algorithm updates✔️\n2. Comprehensive analysis of ALL AVIATOR games every day✔️\n3. Regular updates on all gaming strategies✔️</i>\n\n<u>This ensures that we have every opportunity for successful operations and earnings💯</u>`
//         bot.sendVideo(chatId, videoSecondPost, {
//             caption: text,
//             parse_mode: `HTML`,
//             reply_markup: {
//                 inline_keyboard: [
//                     [{ text: '✅Enter the password', callback_data: 'photoReviewThirdMessageButton' }]
//                 ]
//             }
//         })
//     }
// });

// bot.on('callback_query', (query) => {
//     if (query.data === 'thirdMessageButton') {
//         const chatId = query.message.chat.id;
//         const photoForPost = path.join(__dirname, 'photo1.jpg');
//         let text = `<b>1. Register through the provided LINK⬇️\nhttps://2skonkem5mb.com/rXZs\n\n2. Top up your real balance with 500 Rs+\n\n3. Send a screenshot of the deposit to support ${lichkatext}\n\n4. Enter the password to activate the bot</b>`
//         bot.sendPhoto(chatId, photoForPost, {
//             caption: text,
//             parse_mode: `HTML`,
//             disable_web_page_preview: true,
//             reply_markup: {
//                 inline_keyboard: [
//                     // [{ text: '📺Video tutorial', callback_data: 'videoReviewThirdMessageButton' }],
//                     [{ text: '✅Enter the password', callback_data: 'photoReviewThirdMessageButton' }],
//                     [{ text: '🏆Benefits of AVIATOR GEMINI🏆', callback_data: 'secondMessageButton' }]
//                 ]
//             }
//         })
//     }
// });

// bot.on('callback_query', (query) => {
//     if (query.data === 'videoReviewThirdMessageButton') {
//         const chatId = query.message.chat.id;
//         let videoInstruction = path.join(__dirname, 'videoInstruction.mp4');
//         let textVideo = `In this instructional video, you'll learn the proper usage of signals with our bot.\n\nPlease take a moment to view it, as it's crucial to safeguard your funds!\n\nFor any inquiries, feel free to contact our support team at ${lichkatext}`
//         bot.sendVideo(chatId, videoInstruction, {
//             caption: textVideo
//         })
//     }
// });

bot.on('callback_query', async (query) => {
    if (query.data === 'photoReviewThirdMessageButton') {
        const chatId = query.message.chat.id;
        let photoReview1 = path.join(__dirname, 'photoReview1.jpg');
        let photoReview2 = path.join(__dirname, 'photoReview2.jpg');
        let photoReview3 = path.join(__dirname, 'photoReview3.jpg');
        let photoReview4 = path.join(__dirname, 'photoReview4.jpg');
        let photoReview5 = path.join(__dirname, 'photoReview5.jpg');
        let photoReview6 = path.join(__dirname, 'photoReview6.jpg');
        let photoReview7 = path.join(__dirname, 'photoReview7.jpg');
        let photoReviews = [
            { type: 'photo', media: photoReview1 },
            { type: 'photo', media: photoReview2 },
            { type: 'photo', media: photoReview3 },
            { type: 'photo', media: photoReview4 },
            { type: 'photo', media: photoReview5 },
            { type: 'photo', media: photoReview6 },
            { type: 'photo', media: photoReview7 },
        ]
        await bot.sendMediaGroup(chatId, photoReviews)
        // let photoReview2 = path.join(__dirname, 'photoReview2.jpg');
        // let text2 = `Текст к отзыву`
        // await bot.sendPhoto(chatId, photoReview2, {
        //     caption: text2,
        //     parse_mode: `HTML`,
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{ text: 'Ссылка на личку', url: 'https://t.me/mercedanet'}],
        //             [{ text: 'Возрат ко второму сообщению', callback_data: 'secondMessageButton'}]
        //         ]
        //     }
        // })
        // let photoReview3 = path.join(__dirname, 'photoReview3.jpg');
        // let text3 = `Текст к отзыву`
        // await bot.sendPhoto(chatId, photoReview3, {
        //     caption: text3,
        //     parse_mode: `HTML`,
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{ text: 'Ссылка на личку', url: 'https://t.me/mercedanet'}],
        //             [{ text: 'Возрат ко второму сообщению', callback_data: 'secondMessageButton'}]
        //         ]
        //     }
        // })
        let textAfterReviews = `Join us today, and together we will start your path to financial\nindependence right now. Get the bot password by writing to our support <b>${lichkatext}</b>🤑`
        await bot.sendMessage(chatId, textAfterReviews, {
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔐Type in your password', callback_data: 'typeInPasswordButton' }]
                ]
            }
        })
    }
});

const userStates = {};

bot.on('callback_query', (query) => {
    if (query.data === 'typeInPasswordButton') {
        const chatId = query.message.chat.id;
        let textBeforePassword = `<b>Please enter the password.\n\nIf anything goes wrong, reach out to support for assistance at ${lichkatext}✔️</b>`
        bot.sendMessage(chatId, textBeforePassword, {
            parse_mode: `HTML`,
        })
        userStates[chatId] = 'waiting_for_password';
    }
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (userStates[chatId] === 'waiting_for_password') {
        const enteredPassword = msg.text;

        if (enteredPassword.toLowerCase() === correctPassword.toLowerCase()) {
            const textCheckingPassword = `<code>Checking your password in the database... ⌛️</code>`;
            await bot.sendMessage(chatId, textCheckingPassword, { parse_mode: "HTML" });

            await new Promise(resolve => setTimeout(resolve, 2000));

            const textPasswordCorrect = `<code>Password entered correctly ✅</code>`;
            await bot.sendMessage(chatId, textPasswordCorrect, { parse_mode: "HTML" });

            delete userStates[chatId];

            const textPasswordCorrectMessageTwo = `Ready to start getting signals?`;
            await bot.sendMessage(chatId, textPasswordCorrectMessageTwo, {
                parse_mode: `HTML`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🚀Get signal', callback_data: 'startSignals' }]
                    ]
                }
            });
        } else {
            let textWrongPassword = `<code>Wrong password, try again</code>`;
            bot.sendMessage(chatId, textWrongPassword, {
                parse_mode: `HTML`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '👥Message me', url: `${lichkalink}` }]
                    ]
                }
            });
        }
    }
});


function getRandomCoefficient() {
    const minCoefficient = 1.20;
    const maxCoefficient = 2.50;
    let randomCoefficient;
    if (Math.random() < 0.7) { // Вероятность около 70%
        randomCoefficient = (Math.random() * (1.5 - minCoefficient) + minCoefficient).toFixed(2);
    } else {
        randomCoefficient = (Math.random() * (maxCoefficient - 1.5) + 1.5).toFixed(2);
    }
    return randomCoefficient;
}

// Функция для получения случайной суммы от 50 до 250 с шагом 10
function getRandomAmount() {
    const rawAmount = Math.floor(Math.random() * (21 - 5 + 1)) + 5; // Генерируем случайное число от 5 до 21
    const roundedAmount = rawAmount * 10; // Умножаем на 10 для получения чисел от 50 до 210
    return roundedAmount;
}



let currentAmount = 50;  // Начальное значение randomAmount
let currentCoefficient = getRandomCoefficient();
let consecutiveLoseCount = 0;  // Счетчик подряд проигранных раундов

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'startSignals') {
        let botThinkingText = `Calculating the bet and the optimal amount... ⌛️`
        await bot.sendMessage(chatId, botThinkingText);

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await delay(3000);
        currentCoefficient = getRandomCoefficient();  // Обновляем коэффициент перед новой ставкой
        currentAmount = getRandomAmount();  // Получаем новую случайную сумму

        let textSignal = `<b>💵 Bet: ${currentAmount} RS in the next round\n\n✋ Withdraw at ${currentCoefficient}x</b>`;
        consecutiveLoseCount = 0;  // Сбрасываем счетчик при новой ставке

        await bot.sendMessage(chatId, textSignal, {
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🟢 WIN', callback_data: 'winSignal' },
                    { text: '🔴 LOSE', callback_data: 'loseSignal' }]
                ]
            }
        });
    } else if (query.data === 'loseSignal') {
        let botThinkingText = `Calculating the bet and the optimal amount... ⌛️`
        await bot.sendMessage(chatId, botThinkingText);

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await delay(3000);
        currentCoefficient = getRandomCoefficient();
        currentAmount *= 2;  // Удваиваем текущее значение
        consecutiveLoseCount++;  // Увеличиваем счетчик проигранных раундов

        let textLose = `<b>💵 Bet: ${currentAmount} RS in the next round\n\n✋ Withdraw at ${currentCoefficient}x</b>`;

        if (consecutiveLoseCount >= 3) {
            textLose = 'You are doing something wrong';
            consecutiveLoseCount = 0;  // Сбрасываем счетчик при достижении 3 проигрышей подряд

            // Изменяем inline-клавиатуру на кнопку 'Получить сигнал'
            await bot.sendMessage(chatId, textLose, {
                parse_mode: `HTML`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🚀Get signal', callback_data: 'startSignals' },
                        { text: '👥Message me', url: `${lichkalink}` }]
                    ]
                }
            });
            return;  // Прерываем выполнение кода после отправки сообщения "Ты делаешь что-то не так"
        }

        // Изменяем inline-клавиатуру на кнопки 'win' и 'lose'
        await bot.sendMessage(chatId, textLose, {
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🟢 WIN', callback_data: 'winSignal' },
                    { text: '🔴 LOSE', callback_data: 'loseSignal' }]
                ]
            }
        });
    } else if (query.data === 'winSignal') {
        let botThinkingText = `Calculating the bet and the optimal amount... ⌛️`
        await bot.sendMessage(chatId, botThinkingText);

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await delay(3000);
        currentCoefficient = getRandomCoefficient();  // Обновляем коэффициент при выигрыше
        currentAmount = getRandomAmount();  // Получаем новую случайную сумму

        let textWin = `<b>💵 Bet: ${currentAmount} RS in the next round\n\n✋ Withdraw at ${currentCoefficient}x</b>`;
        consecutiveLoseCount = 0;  // Сбрасываем счетчик при выигрыше

        await bot.sendMessage(chatId, textWin, {
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🟢 WIN', callback_data: 'winSignal' },
                    { text: '🔴 LOSE', callback_data: 'loseSignal' }]
                ]
            }
        });
    }
});



