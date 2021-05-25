/* App */
const app = new Vue ({
    el: '#app',
    data: {
        contacts: [
            {
                name: 'Michele',
                avatar: '_1',
                visible: true,
                messages: [
                    {
                        date: '10/01/2020 15:30:55',
                        text: 'Hai portato a spasso il cane?',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 15:50:00',
                        text: 'Ricordati di dargli da mangiare',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 16:15:22',
                        text: 'Tutto fatto!',
                        status: 'received'
                    }
                ],
            },
            {
                name: 'Fabio',
                avatar: '_2',
                visible: true,
                messages: [
                    {
                        date: '20/03/2020 16:30:00',
                        text: 'Ciao come stai?',
                        status: 'sent'
                    },
                    {
                        date: '20/03/2020 16:30:55',
                        text: 'Bene grazie! Stasera ci vediamo?',
                        status: 'received'
                    },
                    {
                        date: '20/03/2020 16:35:00',
                        text: 'Mi piacerebbe ma devo andare a fare la spesa.',
                        status: 'sent'
                    }
                ],
            },
            {
                name: 'Samuele',
                avatar: '_3',
                visible: true,
                messages: [
                    {
                        date: '28/03/2020 10:10:40',
                        text: 'La Marianna va in campagna',
                        status: 'received'
                    },
                    {
                        date: '28/03/2020 10:20:10',
                        text: 'Sicuro di non aver sbagliato chat?',
                        status: 'sent'
                    },
                    {
                        date: '28/03/2020 16:15:22',
                        text: 'Ah scusa!',
                        status: 'received'
                    }
                ],
            },
            {
                name: 'Luisa',
                avatar: '_4',
                visible: true,
                messages: [
                    {
                        date: '10/01/2020 15:30:55',
                        text: 'Lo sai che ha aperto una nuova pizzeria?',
                        status: 'sent'
                    },
                    {
                        date: '10/01/2020 15:50:00',
                        text: 'Si, ma preferirei andare al cinema',
                        status: 'received'
                    }
                ],
            },
        ],
        me: {
            avatar: '_io',
            name: 'Nome Utente'
        },
        current: '',
        audiourl: ''
    },
    methods: {
        /**
         * ### getCurrent
         * Given an array of contacts, return the chosen active with index
         * @param {Array} list 
         * @param {Number} index 
         * @returns {Object} The object of the current user
         */
        getCurrent(list, index) {
            return list[index];
        },
        /**
         * ### getDate
         * @returns {String} The current date with the specified format
         */
        getDate() {
            return `${dayjs().format('DD/MM/YYYY HH:mm:ss')}`;
        },
        /**
         * ### getLastDate
         * Given an index, return the last activity of the user in the contacts list
         * @param {Number} index 
         * @returns {string} The last message date
         */
        getLastDate(index) {
            let lastIndex = this.contacts[index]['messages'].length;
            let lastMsgTime = this.contacts[index]['messages'][lastIndex-1]['date'];
            
            let first = lastMsgTime.substring(0, lastMsgTime.indexOf(' '));
            let second = lastMsgTime.substring(lastMsgTime.indexOf(' ') + 1, lastMsgTime.length);
            let numbers = first.split('/');

            if (dayjs().get('year') == Number(numbers[2])) {
                if ((dayjs().get('month') + 1) == Number(numbers[1])) {
                    if (dayjs().get('D') == Number(numbers[0])) {
                        lastMsgTime = `oggi alle ${second}`;
                    } else if ((dayjs().get('D') + 1) == Number(numbers[0])) {
                        lastMsgTime = `ieri alle ${second}`;
                    }
                }
            } 
            return lastMsgTime;   
        },
        /**
         * ### getLastMsg
         * Given an index, return the last message of the user with index in the contacts list
         * @param {Number} index 
         * @returns {string} The last message sent/received by the user
         */
        getLastMsg(index) {
            let lastIndex = this.contacts[index]['messages'].length;
            let lastMsg = this.contacts[index]['messages'][lastIndex-1]['text'];

            if (lastMsg.includes('blob') || (lastMsg.includes('http'))) lastMsg = 'Audio';
            
            return lastMsg;
        },
        /**
         * ### deleteMessage
         * Given an index, remove the message from the current user
         * @param {Number} index 
         */
        deleteMessage(index) {
            (confirm('Are you sure you want to delete this message?')) ? this.current['messages'].splice(index, 1) : '';
        },
        /**
         * ### newMessage
         * Create a new message object and push it into the current user messages
         * @param {string} message 
         * @param {string} date 
         * @param {string} status 
         * @param {Boolean} audio 
         */
        newMessage(message, date, status, audio = false) {
            let msgObj = {
                date: date,
                status: status,
                text: message
            }

            if (audio) msgObj.url = message;

            this.current['messages'].push(msgObj);
            this.current['lastseen'] = this.getLastDate(this.current['id'] - 1);
            this.current['lastmsg'] = this.getLastMsg(this.current['id'] - 1);
        },
        /**
         * ### sendMessage
         * Get the current text of the textarea and call the newMessage function
         */
        sendMessage() {
            let message_textarea = document.querySelector('.inputs > textarea');
            let message = (message_textarea.value).replaceAll('\n', '').trim();
            
            if (message.length >= 1) {
                let msgDate = this.getDate();
                let msgStatus = "sent";
    
                this.newMessage(message, msgDate, msgStatus);
           
                this.scrollDown();
                message_textarea.value = '';
                this.receiveMsg();
            } else {
                message_textarea.value = '';
            }            
        },
        /**
         * ### receiveMsg
         * Automatically create a response to a new message
         */
        receiveMsg() {
            setTimeout(()=>{
                let message = "Roger that!";
                let msgDate = this.getDate();
                let msgStatus = "received";
    
                this.newMessage(message, msgDate, msgStatus);
                this.scrollDown();
            }, 1000);
        },
        /**
         * ### filterContacts
         * Given a specified string, filter che contacts list and set the contacts visible attribute to true or false
         */
        filterContacts() {
            let filter = document.querySelector('#search').value.toLowerCase();
            this.contacts.forEach((element) => {
                (element.name.toLowerCase().indexOf(filter) === -1) ? element.visible = false : element.visible = true;
            }); 
        },
        /**
         * ### showOptions
         * Show message options with index as id on click
         * @param {Number} index 
         */
        showOptions(index) {
            let options = document.querySelectorAll('.message > div > div');
            options.forEach((element) => {
                if (element.id.includes(index)) {
                    if (!element.classList.contains('d-none')){
                        element.classList.add('d-none');
                        element.classList.remove('d-block');
                    } else {
                        element.classList.remove('d-none');
                        element.classList.add('d-block');
                    }
                }
            });
        },
        /**
         * ### hideOptions
         * Hide all the message options
         */
        hideOptions() {
            let options = document.querySelectorAll('.message > div > div');
            options.forEach((element) => {
                if (element.classList.contains('d-block')){
                    element.classList.remove('d-block');
                }
                element.classList.add('d-none'); 
            });
        },
        /**
         * ### scrollDown
         * Automatically scrolls to the last message in the chat
         */
        scrollDown() {
            var div = document.querySelector('.messages');
            div.scrollTop = div.scrollHeight - div.clientHeight;
        },
        /**
         * ### startRecording
         * Start recording an audio message
         */
        startRecording() {
            let buttons = document.querySelectorAll('.inputs > div > i');
            buttons.forEach((element) => {
                if (!element.classList.contains('d-none')){
                    element.classList.add('d-none');
                    element.classList.remove('d-block');
                } else {
                    element.classList.remove('d-none');
                    element.classList.add('d-block');
                }
            });   
            recorder.start();
        },
        /**
         * ### stopRecording
         * Stop recording the audio message, send the message with the recording and the automatic audio message response
         */
        stopRecording() {
            let buttons = document.querySelectorAll('.inputs > div > i');
            buttons.forEach((element) => {
                if (!element.classList.contains('d-none')){
                    element.classList.add('d-none');
                    element.classList.remove('d-flex');
                } else {
                    element.classList.remove('d-none');
                    element.classList.add('d-flex');
                }
            });   
            recorder.stop();

            setTimeout(() => {
                let message = this.audiourl;
                let date = this.getDate();
                let status = "sent";

                this.newMessage(message, date, status, true);
            }, 10);

            setTimeout(() => {
                let message = 'https://cs281.clideo.com/p/BfctBMjLR3ASjYONQYWeuQ/8890e0a993227d4ab8297fc46038f33f/uefa-champions-league-2015-16-intro-hd_mzcw2Sgx.mp3';
                let date = this.getDate();
                let status = "received";

                this.newMessage(message, date, status, true);
            }, 100);
        },
        /**
         * ### searchMsg
         * Open the search toolbox for the messages in the current conversation
         */
        searchMsg() {
            let search = document.querySelector('.tools_self > .search_msg');
            
            if (search.classList.contains('d-none')) {
                search.classList.remove('d-none');
            } else {
                search.classList.add('d-none');
            }
        },
        /**
         * ### filterMessages
         * Filter the contacts list by the user input
         */
        filterMessages() {
            let textToSearch = document.querySelector('#search_text').value.toLowerCase();
            let messages = document.querySelectorAll('.message > div > span.text');
            
            messages.forEach(element => {
                let text = element.innerHTML.toLowerCase();
                if (text.includes(textToSearch) && textToSearch.length > 0) { 
                    element.parentElement.style.background = '#ffeb3b'; 
                    let parentId = element.parentElement.id;
                    document.getElementById(parentId).scrollIntoView();
                } else { 
                    element.parentElement.style.background = '';
                }; 
            });
        }
    },
    mounted: function() {
        this.current = this.getCurrent(this.contacts, 0);
        this.current.id = (this.contacts[0]['avatar'].substring(1, 2));
        this.contacts[0]['lastseen'] = this.getLastDate(0);
        this.contacts[0]['lastmsg'] = this.getLastMsg(0);

        let left_contacts = document.querySelectorAll('.contacts > div');
        left_contacts.forEach(element => {
            element.addEventListener("click", () => {
                this.hideOptions();
                this.current = this.getCurrent(this.contacts, element.id)
                this.current.id = (this.contacts[element.id]['avatar'].substring(1, 2));
                this.contacts[this.current.id - 1]['lastseen'] = this.getLastDate(this.current.id - 1);
                this.contacts[this.current.id - 1]['lastmsg'] = this.getLastMsg(this.current.id - 1);
            });  
        });

        let recordButton = document.getElementById('btnRec');
        let stopButton = document.getElementById('btnStop');

        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            recordButton.addEventListener('click', this.startRecording);
            stopButton.addEventListener('click', this.stopRecording);
            
            recorder = new MediaRecorder(stream);
            recorder.addEventListener('dataavailable', onRecordingReady);
        });

        function onRecordingReady(e) {
            app.audiourl = URL.createObjectURL(e.data);
        }
    }
});