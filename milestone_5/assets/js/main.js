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
        current: '',
        conversation: ''
    },
    methods: {
        getName(contact, index) {
            return contact[index]['name'];
        },
        getAvatar(index) {
            return `./assets/img/avatar_${index+1}.jpg`;
        },
        getCurrent(list, index) {
            return list[index];
        },
        getConversation(index) {
            return this.contacts[index]['messages'];
        },
        getDate() {
            let d = new Date();
            return `${this.formatZero(d.getDate())}/${this.formatZero(d.getMonth()+1)}/${d.getFullYear()} ${this.formatZero(d.getHours())}:${this.formatZero(d.getMinutes())}:${this.formatZero(d.getSeconds())}`;
        },
        sendMessage() {
            let message_textarea = document.querySelector('.inputs > textarea');
            let message = (message_textarea.value).replaceAll('\n', '');
            let msgDate = this.getDate();
            let msgStatus = "sent";

            let msgObj = {
                date: msgDate,
                status: msgStatus,
                text: message
            }
            
            this.current['messages'].push(msgObj);
            this.scrollDown();
            message_textarea.value = '';
            this.receiveMsg();
        },
        receiveMsg() {
            setTimeout(()=>{
                let message = "Roger that!";
                let msgDate = this.getDate();
                let msgStatus = "received";
    
                let msgObj = {
                    date: msgDate,
                    status: msgStatus,
                    text: message
                }
                
                this.current['messages'].push(msgObj);
                this.scrollDown();
            }, 1000);
        },
        filterContacts() {
            let filter = document.querySelector('#search').value.toLowerCase();
            this.contacts.forEach((element, index) => {
                if (element.name.toLowerCase().indexOf(filter) === -1) {
                    document.getElementById(''+index).style.display = 'none';
                } else {
                    document.getElementById(''+index).style.display = '';
                }
            });
        },
        formatZero(stringa) {
            let n = parseInt(stringa);
            let newStr = '';
            (n < 10) ? newStr = newStr = `0${stringa}` : newStr = stringa;
            return newStr;
        },
        scrollDown() {
            var div = document.querySelector('.messages');
            div.scrollTop = div.scrollHeight - div.clientHeight;
        }
    },
    mounted: function() {
        this.current = this.getCurrent(this.contacts, 0);
        this.conversation = this.getConversation(0);

        let left_contacts = document.querySelectorAll('.contacts > div');
        left_contacts.forEach(element => {
            element.addEventListener("click", () => {
                this.current = this.getCurrent(this.contacts, element.id)
                this.conversation = this.getConversation(element.id);
            });  
        });
    }
});