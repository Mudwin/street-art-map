class Filters {
  selectors = {
    filters: "[data-js-filters]",
    openButton: "[data-js-filters-open-button]",
    closeButton: "[data-js-filters-close-button]",
  };

  stateClasses = {
    isOpened: "is-opened",
    isClosed: "is-closed",
  };

  onOpenButtonClick = () => {
    this.openButtonElement.classList.add(this.stateClasses.isOpened);
    this.filtersElement.classList.remove(this.stateClasses.isClosed);
  };

  onCloseButtonClick = () => {
    this.filtersElement.classList.add(this.stateClasses.isClosed);
    this.openButtonElement.classList.remove(this.stateClasses.isOpened);
  };

  bindEvents() {
    this.openButtonElement.addEventListener("click", this.onOpenButtonClick);
    this.closeButtonElement.addEventListener("click", this.onCloseButtonClick);
  }

  constructor() {
    this.filtersElement = document.querySelector(this.selectors.filters);
    this.openButtonElement = document.querySelector(this.selectors.openButton);
    this.closeButtonElement = document.querySelector(
      this.selectors.closeButton
    );

    this.bindEvents();
  }
}

export default Filters;
