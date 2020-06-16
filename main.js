(() => {
    class TestTakers extends HTMLElement {
        async connectedCallback() {
            this.direction = 1;
            this.classList.add('tt')
            this.list = document.createElement('ol');
            this.list.className = 'list';
            this.list.addEventListener('click', ({target}) => this.selectedUser(target));

            this.info = document.createElement('div');
            this.info.className = 'info';

            this.sortButton = document.createElement('button');
            this.sortButton.innerHTML = 'Sort';
            this.sortButton.addEventListener('click', ({target}) => this.sortUses());

            const number = this.getAttribute('number')
            this.users = [];
            try {
                this.users = await this.getUsers(number)
            } catch (e) {
                this.innerHTML = 'Server Error';
                return
            }
            this.displayUsers()


            this.append(this.list);
            this.append(this.info)
            this.prepend(this.sortButton);
        }

        displayUserInfo(userInfo) {
            this.info.innerHTML = `<img src="${userInfo.picture}" alt="photo"/><h1>${userInfo.title} ${userInfo.firstName} ${userInfo.lastName}</h1> <p><b>gender:</b> ${userInfo.gender}  <br><b>email:</b> ${userInfo.email}<br><b>userId:</b> ${userInfo.userId}<br><b>login:</b> ${userInfo.login}<br><b>password:</b> ${userInfo.password}<br><b>address:</b> ${userInfo.address} </p>`

        }

        displayUsers() {
            this.list.innerHTML = ''
            this.users.forEach(({userId, firstName, lastName}) => {
                const user = document.createElement('li');
                user.innerHTML = `${lastName} ${firstName}`;
                user.dataset.id = userId;
                this.list.append(user);
            })

            if(this.selected){
                this.selected = this.list.querySelector(`[data-id="${this.selected.dataset.id}"]`);
                this.list.querySelector(`[data-id="${this.selected.dataset.id}"]`).classList.add('selected');
            }
        }

        sortUses() {
          this.users.sort((user1, user2) =>
                    ((user1.lastName + user1.firstName) <= (user2.lastName + user2.firstName)) ? -this.direction : this.direction);

            this.direction = - this.direction;
            this.displayUsers()
        }

        async selectedUser(userElement) {
            let userInfo = {};
            try {
                userInfo = await this.getUserInfo(userElement.dataset.id)
                this.displayUserInfo(userInfo)
            } catch (e) {
                this.info.innerHTML = `there isn't information about ${userElement.innerHTML}`;
            }
            if (this.selected) {
                this.selected.classList.remove('selected');
            }
            this.selected = userElement;
            this.selected.className = 'selected';
        }

        async getUserInfo(id) {
            return await fetch(`https://hr.oat.taocloud.org/v1/user/${id}`)
                .then((response) => response.json())
        }

        async getUsers(number = 20) {
            return await fetch(`https://hr.oat.taocloud.org/v1/users?limit=${number}&offset=0`)
                .then((response) => response.json())
        }

    }

    customElements.define('test-takers', TestTakers);
})()

