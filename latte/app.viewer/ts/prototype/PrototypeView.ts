module latte {

    /**
     *
     */
    export class PrototypeView extends PrototypeViewBase {

        //region Static
        static changeView(element: Element<HTMLElement>, display: string ){
            if( element.style.display == display )
                element.style.display = "none";
            else
                element.style.display = display;
        }

        static evaluate(str: string){
            let exp = /^(?!.*[\!\"\#\$\%\&\(\)\=\'\¿\¡\<\>\´\+\{\}\-\~\^\`\*\¨\:\;])[a-zA-Z0-9\s]+/;
            return exp.exec(str);
        }
        //endregion

        //region Fields
        //endregion

        /**
         *
         */
        constructor() {
            super();
            this.onLoad();
        }

        //region Private Methods
        /**
         * add new mark to image
         * @param ev
         */
        private addMark(ev, idowner, owner) {

            let x = ev.layerX;
            let y = ev.layerY;

            if (y - 28 <= 0) y += 28 - y;

            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;

            let real_x = (x * 100) / scale - this.image.offsetLeft;
            let real_y = (y * 100) / scale - this.image.offsetTop;

            let markItem = new MarkItem();
            markItem.posx = real_x;
            markItem.posy = real_y;

            markItem.idowner = idowner;
            markItem.owner = owner;
            markItem.image = this.image;

            markItem.showConversation(ev);

            markItem.removeMark.add(() => {
                if (markItem != null) {
                    markItem.removeFromParent();
                    markItem = null;
                }
            });

            // this.setPositionMark( markItem, real_x, real_y);
            this.containerImage.add(markItem);
            this.showMarks();

            markItem.setPositionMark();
        }

        /**
         * swap style display of element
         * @param {latte.Element<HTMLElement>} element
         * @param {string} display
         */
        private changeView(element: Element<HTMLElement>, display: string) {
            if (element.style.display == display)
                element.style.display = "none";
            else
                element.style.display = display;
        }

        /**
         * evaluate the string.
         */
        private evaluate(str: string) {
            let exp = /^(?!.*[\!\"\#\$\%\&\(\)\=\'\¿\¡\<\>\´\+\{\}\-\~\^\`\*\¨\:\;])[a-zA-Z0-9\s]+/;
            return exp.exec(str);
        }

        /**
         * assign position to mark
         * @param {latte.MarkItem} markItem
         * @param {number} x
         * @param {number} y
         */
        private setPositionMark(markItem: MarkItem, x: number, y: number) {

            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;
            let newX = x * (scale / 100) + this.image.offsetLeft;
            let newY = y * (scale / 100) + this.image.offsetTop - 28;

            markItem.style.left = newX + "px";
            markItem.style.top = newY + "px";
        }

        /**
         * scrolll window to position of x,y
         * @param {number} x
         * @param {number} y
         */
        private setScrollToMark(x: number, y: number) {
            let scale = (this.image.clientWidth * 100) / this.image.naturalWidth;
            let newX = x * (scale / 100) + this.image.offsetLeft;
            let newY = y * (scale / 100) + this.image.offsetTop - 28;

            window.scrollTo(newX, newY - 100);
        }

        /**
         * set selected history item.
         * @param idowner
         */
        private setHistorySelected(idowner, owner) {
            let items = this.historyList.getCollection();
            for (let i = 0; i < items.length; i++) {
                if (items[i] instanceof HistoryItem) {
                    if (items[i].history.idhistory == idowner && items[i].history.owner == owner) {
                        items[i].style.backgroundColor = "var(--accent-color)";
                        items[i].style.color = "var(--text-icons)";
                        items[i].style.borderRadius = "2px";
                    } else {
                        items[i].style.backgroundColor = "var(--text-icons)";
                        items[i].style.color = "var(--primary-text)";
                        items[i].style.borderRadius = "2px";
                    }
                }
            }
        }

        /**
         * show marks, buttons navigation and navbar
         */
        private showMarks(){
            this.btnShowMarksMobile.text = strings.hideItems;

            this.btnShowMarks.text = "visibility_off";
            this.stateMarks = true;

            this.navbarPrototype.style.opacity = "1";
            this.btnBefore.style.display = "flex";
            this.btnNext.style.display = "flex";
            this.containerImage.style.marginTop = "3.2em";

            let marksItems = this.containerImage.getCollection();
            for (let i = 0; i < marksItems.length; i++)
                if (marksItems[i] instanceof MarkItem) marksItems[i].showMark();
        }

        /**
         *  hide marks, buttons navigation and navbar
         */
        private hideMarks(){
            this.btnShowMarksMobile.text = strings.showItems;

            this.btnShowMarks.text = "visibility";
            this.stateMarks = false;

            this.navbarPrototype.style.opacity = "0";
            this.btnBefore.style.display = "none";
            this.btnNext.style.display = "none";
            this.containerImage.style.marginTop = "0";

            let marksItems = this.containerImage.getCollection();
            for(let i=0; i < marksItems.length; i++)
                if( marksItems[i] instanceof MarkItem ) marksItems[i].hideMark();
        }

        /**
         * return position of prototype over array of prototypes local.
         * @param idimage
         * @param prototypes
         * @returns {number}
         */
        private getPositionPrototype(idimage, prototypes){
            let i = 0;
            while( i < prototypes.length && prototypes[i].idimage != idimage ) i++;
            return i;
        }

        /**
         *
         * @param idimage
         * @param prototypes
         * @returns {any}
         */
        private getAssociate(idimage, prototypes){
            let i = 0;
            while( i < prototypes.length && prototypes[i].idassociate != idimage ) {
                i++;
            }
            return prototypes[i];
        }

        /**
         * get prototype of history
         * @param idhistory
         * @param historyArray
         * @returns {any}
         */
        private getHistory( idhistory, historyArray ){
            let i = 0;
            while( i < historyArray.length && historyArray[i].idhistory != idhistory ) i++;
            return historyArray[i];
        }

        /**
         * Assign events to notification view elements
         * @param {latte.NotificationView} view
         */
        private loadNotificationView(view: NotificationView) {
            view.notificationSelectedChanged.add(() => {
                let notification = view.notificationSelected;

                this.conversationPulse = notification.idconversation;

                if( notification.owner == "History" ) {
                    this.idhistory = notification.idowner;
                } else {
                    this.idhistory = 0;
                }
                this.prototype = notification.prototype;
            });
        }
        //endregion

        //region Methods
        /**
         *  show previous prototype
         */
        btnBefore_click(){
            this.previousPrototype();
        }

        /**
         * show next prototype
         */
        btnNext_click(){
            this.nextPrototype();
        }

        /**
         * button close dialog info prototype
         */
        btnCloseInfo_click(){
            this.changeView( this.infoPrototype, "block" );
        }

        /**
         * click button device change desktop - mobile
         */
        btnDevice_click(){

            if( this.prototype.idassociate != 0 ){
                let type = ( this.prototype.type == 1 )? 1:0;
                this.prototype = this.getAssociate(this.prototype.idimage, this.localPrototypes[type] );
            }
        }

        btnDeviceMobile_click(){
            this.btnDevice_click();
        }

        /**
         * show dialog width info the prototype
         */
        btnInfo_click(){
            this.changeView( this.infoPrototype, "block" );
        }

        btnInfoMobile_click(){
            this.btnInfo_click();
        }

        /**
         * show marks or conversation of prototype
         */
        btnShowMarks_click() {
            this.stateMarks? this.hideMarks() : this.showMarks();
        }

        btnShowMarksMobile_click(){
            this.btnShowMarks_click();
        }

        /**
         * load all conversation
         */
        loadConversation(idowner, owner ) {
            Conversation.byIdOwner(idowner, owner).send(conversations => {
                if (conversations.length > 0) {
                    conversations.forEach(conversation => {
                        let markItem = new MarkItem();
                        markItem.conversation = conversation;
                        markItem.image = this.image;

                        if (conversation.idconversation == this.conversationPulse) {
                            markItem.addPulse();
                            this.setScrollToMark(conversation.posx, conversation.posy);
                        }

                        this.setPositionMark(markItem, conversation.posx, conversation.posy);
                        this.containerImage.raw.appendChild(markItem.raw);
                    });
                }
                this.loader.hidden();
            });
        }

        /**
         * load history list
         */
        loadHistoryList(history) {
            this.historyList.clear();

            this.btnHistoryMobile.style.display = 'block';
            this.btnHistoryMobile.text = strings.history;

            // ASSIGN ITEM OF VERSION 0 - PROTOTYPE ORIGIN
            let historyItem = new HistoryItem();
            let historyrecord = new History();
            historyrecord.owner = "Image";
            historyrecord.idhistory = this.prototype.idimage;
            historyItem.history = historyrecord;
            historyItem.click.add(() => this.loadImage(this.prototype.guid, this.prototype.idimage, "Image"));
            historyItem.text = "V0 : " + this.prototype.created.toString();
            this.historyList.add(historyItem);
            // END OF ASSIGN

            history.forEach((item, index) => {
                let historyItem = new HistoryItem();
                historyItem.history = item;
                historyItem.history.owner = "History";
                historyItem.click.add(() => {
                    this.loadImage(historyItem.history.guid, historyItem.history.idhistory, "History");
                });

                historyItem.text = "V" + (index + 1) + " : " + item.created.toString();

                this.historyList.add(historyItem);
            });
        }

        /**
         * load image width guid of prototype.
         * @param guid
         */
        loadImage(guid, idowner, owner) {

            this.idhistory = -1;
            this.containerImage.clear();

            let tagImage: Element<HTMLImageElement> = <Element<HTMLImageElement>> new MemoryElement('img');
            tagImage.element.src = strings.pathImages + guid + ".png";

            this.containerImage.add(tagImage);

            tagImage.addEventListener('load', () => {
                this.image = this.containerImage.querySelector("img");
                this.image.style.maxWidth = this.image.naturalWidth + "px";
                this.loadConversation(idowner, owner);
            });

            tagImage.addEventListener('dblclick', ev => this.addMark(ev, idowner, owner));

            this.setHistorySelected(idowner, owner );
        }

        /**
         * last update to prototype
         */
        loadLastPrototype() {
            this.loader.show();

            History.search({
                idimage: this.prototype.idimage
            }).send(history => {
                if (history.length > 0) {

                    this.btnHistory.style.display = "block";
                    this.loadHistoryList(history);

                    let proto = history[history.length - 1];

                    if( this.idhistory > 0 ){
                        proto = this.getHistory( this.idhistory, history );
                        this.loadImage(proto.guid, proto.idhistory, "History");
                    }else if( this.idhistory < 0 )
                        this.loadImage(proto.guid, proto.idhistory, "History");
                    else if( this.idhistory == 0 )
                        this.loadImage(this.prototype.guid, this.prototype.idimage, "Image");

                } else {
                    this.btnHistory.style.display = "none";
                    this.loadImage(this.prototype.guid, this.prototype.idimage, "Image");
                    this.historyList.clear();
                }
            });
        }

        /**
         * load prototypes of category.
         */
        loadPrototypes(){
            Image.byCategory(this.prototype.idcategory).send( prototypes => {
                this.localPrototypes = prototypes;
                this.loader.hidden();

                let type = (this.prototype.type == 1)? 0:1;
                let pos = this.getPositionPrototype(this.prototype.idimage, this.localPrototypes[type] );

                this.countPrototypes.text =  (pos+1) + "/" + this.localPrototypes[type].length;
            });
        }

        /**
         * load componenets and events.
         */
        onLoad(){

            this.btnShowMarksMobile.text = strings.hideItems;
            this.btnInfoMobile.text = strings.information;
            this.btnHistoryMobile.text = strings.history;

            this.containerNotifications.add(this.notificationView);

            this.selectCategory.selectedCategoryChanged.add(() => {
                Image.searchOne({
                    idcategory: this.selectCategory.selectedCategory,
                    trash: 'false',
                    archived: 'false'
                },'name').send(prototype => {
                    this.prototype = prototype;
                });
            });

            this.containerLoader.add( this.loader );
            this.cntSelectCategory.add( this.selectCategory );


            window.addEventListener('keyup', ev =>{
                if( ev.keyCode == 39 ) this.nextPrototype();
                if( ev.keyCode == 37) this.previousPrototype();
            });
            window.addEventListener('click',ev => {

                if( ev.target == this.btnHistory.raw || ev.target == this.btnHistoryMobile.raw)
                    this.changeView(this.historyList, "flex");
                else{
                    this.historyList.style.display = "none";
                }

                if(ev.target  == this.iconMenu.raw ){
                    this.changeView(this.containerMenuMobile, "block");
                }else{
                    this.containerMenuMobile.style.display = "none";
                }
            });
        }

        /**
         * Raises the <c>prototype</c> event
         */
        onPrototypeChanged(){
            if(this._prototypeChanged){
                this._prototypeChanged.raise();
            }

            if( this.prototype != null ){

                this.loader.show();

                this.btnDeviceMobile.style.display = 'none';
                this.btnHistoryMobile.style.display = 'none';

                if (this.prototype.idassociate != 0) {
                    this.btnDevice.text = "phone_iphone";

                    this.btnDeviceMobile.style.display = 'block';
                    this.btnDeviceMobile.text = strings.mobileVersion;

                    if (this.prototype.type == 2){
                        this.btnDevice.text = "desktop_windows";
                        this.btnDeviceMobile.text = strings.deskVersion;
                    }
                } else {
                    this.btnDevice.text = "";
                }

                this.namePrototype.text = this.prototype.name;
                this.descriptionPrototype.text = this.prototype.description;
                this.datePrototype.text = this.prototype.created.toString();

                this.loadLastPrototype();
                this.loadPrototypes();

                this.selectCategory.idcategory = this.prototype.idcategory;

                Project.getIdProject(this.prototype.idimage).send(project => {
                    this.project = project;
                    this.notificationView.idproject = this.project.idproject;
                });
            }
        }

        /**
         * will assign the local prototype if there is a next
         */
        nextPrototype(){
            this.loader.show();

            let type = ( this.prototype.type == 1 )? 0 : 1;
            let pos = this.getPositionPrototype(this.prototype.idimage, this.localPrototypes[type] );
            if( pos+1 >= this.localPrototypes[type].length )
                this.loader.hidden();
            else{
                this.prototype = this.localPrototypes[type][pos+1];
                this.countPrototypes.text = (pos+1) + "/" + this.localPrototypes[type].length;
            }

        }

        /**
         * will assign the local prototype if there is a previous
         */
        previousPrototype(){
            this.loader.show();

            let type = ( this.prototype.type == 1 )? 0 : 1;
            let pos = this.getPositionPrototype(this.prototype.idimage, this.localPrototypes[type] );
            if( pos-1 < 0 )
                this.loader.hidden();
            else{
                this.prototype = this.localPrototypes[type][pos-1];
                this.countPrototypes.text = (pos+1) + "/" + this.localPrototypes[type].length;
            }
        }
        //endregion

        //region Events
        /**
         * Back field for event
         */
        private _prototypeChanged: LatteEvent;

        /**
         * Gets an event raised when the value of the prototype property changes
         *
         * @returns {LatteEvent}
         */
        get prototypeChanged(): LatteEvent{
            if(!this._prototypeChanged){
                this._prototypeChanged = new LatteEvent(this);
            }
            return this._prototypeChanged;
        }
        //endregion

        //region Properties
        /**
         * Property field
         */
        private _conversationPulse: number = null;

        /**
         * Gets or sets idconversation add animation
         *
         * @returns {number}
         */
        get conversationPulse(): number {
            return this._conversationPulse;
        }

        /**
         * Gets or sets idconversation add animation
         *
         * @param {number} value
         */
        set conversationPulse(value: number) {
            this._conversationPulse = value;
        }

        /**
         * Property field
         */
        private _prototype: Image = null;

        /**
         * Gets or sets prototype
         *
         * @returns {Image}
         */
        get prototype(): Image{
            return this._prototype;
        }

        /**
         * Gets or sets prototype
         *
         * @param {Image} value
         */
        set prototype(value: Image){

            // Check if value changed
            let changed: boolean = value !== this._prototype;

            // Set value
            this._prototype = value;

            // Trigger changed event
            if(changed){
                this.onPrototypeChanged();
            }
        }

        /**
         * Property field
         */
        private _image: any = null;

        /**
         * Gets or sets image
         *
         * @returns {any}
         */
        get image(): any {
            return this._image;
        }

        /**
         * Gets or sets image
         *
         * @param {any} value
         */
        set image(value: any) {
            this._image = value;
        }

        /**
         * Property field
         */
        private _stateMarks: boolean = true;

        /**
         * Gets or sets state of marks
         *
         * @returns {boolean}
         */
        get stateMarks(): boolean {
            return this._stateMarks;
        }

        /**
         * Gets or sets state of marks
         *
         * @param {boolean} value
         */
        set stateMarks(value: boolean) {
            this._stateMarks = value;
        }

        /**
         * Property field
         */
        private _localPrototypes: Image[][] = null;

        /**
         * Gets or sets prototypes use local
         *
         * @returns {Image[][]}
         */
        get localPrototypes(): Image[][] {
            return this._localPrototypes;
        }

        /**
         * Gets or sets prototypes use local
         *
         * @param {Image[][]} value
         */
        set localPrototypes(value: Image[][]) {
            this._localPrototypes = value;
        }

        /**
         * Property field
         */
        private _forcePrototype: boolean = false;

        /**
         * Gets or sets when it is necessary to show the specific prototype
         *
         * @returns {boolean}
         */
        get forcePrototype(): boolean {
            return this._forcePrototype;
        }

        /**
         * Gets or sets when it is necessary to show the specific prototype
         *
         * @param {boolean} value
         */
        set forcePrototype(value: boolean) {
            this._forcePrototype = value;
        }

        /**
         * Property field
         */
        private _idhistory: number = -1;

        /**
         * Gets or sets idhistory
         *
         * @returns {number}
         */
        get idhistory(): number {
            return this._idhistory;
        }

        /**
         * Gets or sets idhistory
         *
         * @param {number} value
         */
        set idhistory(value: number) {
            this._idhistory = value;
        }

        /**
         * Property field
         */
        private _project: Project = null;

        /**
         * Gets or sets project
         *
         * @returns {Project}
         */
        get project(): Project {
            return this._project;
        }

        /**
         * Gets or sets project
         *
         * @param {Project} value
         */
        set project(value: Project) {
            this._project = value;
        }
        //endregion

        //region components
        /**
         * Field for loader property
         */
        private _loader: LoaderItem;

        /**
         * Gets loader
         *
         * @returns {LoaderItem}
         */
        get loader(): LoaderItem {
            if (!this._loader) {
                this._loader = new LoaderItem();
            }
            return this._loader;
        }

        /**
         * Field for selectCategory property
         */
        private _selectCategory: SelectCategory;

        /**
         * Gets select category item
         *
         * @returns {SelectCategory}
         */
        get selectCategory(): SelectCategory {
            if (!this._selectCategory) {
                this._selectCategory = new SelectCategory();
            }
            return this._selectCategory;
        }

        /**
         * Field for notificationView property
         */
        private _notificationView: NotificationView;

        /**
         * Gets notification view
         *
         * @returns {NotificationView}
         */
        get notificationView(): NotificationView {
            if (!this._notificationView) {
                this._notificationView = new NotificationView();
                this.loadNotificationView( this._notificationView );
            }
            return this._notificationView;
        }
        //endregion
    }

}