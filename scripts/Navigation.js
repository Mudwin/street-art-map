class Navigation {
  selectors = {
    navigationMenu: "[data-js-navigation]",
    openButton: "[data-js-open-button]",
  };

  stateClasses = {
    isOpened: "is-opened",
    isClosed: "is-closed",
  };

  onOpenButtonClick = () => {
    this.navigationMenuElement.classList.toggle(this.stateClasses.isOpened);
    this.navigationMenuElement.classList.toggle(this.stateClasses.isClosed);
    this.openButtonElement.classList.toggle(this.stateClasses.isOpened);
    this.openButtonElement.classList.toggle(this.stateClasses.isClosed);

    console.log(this.openButtonElement.classList);
  };

  bindEvents() {
    this.openButtonElement.addEventListener("click", this.onOpenButtonClick);
  }

  constructor() {
    this.navigationMenuElement = document.querySelector(
      this.selectors.navigationMenu
    );
    this.openButtonElement = document.querySelector(this.selectors.openButton);

    this.bindEvents();
  }
}

export default Navigation;
