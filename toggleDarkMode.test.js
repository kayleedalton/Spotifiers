import { toggleDarkMode } from './script'; 

describe('toggleDarkMode', () => {
  beforeAll(() => {
    // Mocking document.body
    document.body = document.createElement('body');
    document.body.classList.add('light-mode'); 

    // Mocking  table 
    const table = document.createElement('div');
    table.classList.add('table', 'table-dark'); 
    document.body.appendChild(table);

    global.document.querySelector = jest.fn().mockImplementation(selector => {
      return document.body.querySelector(selector);
    });
  });

  it('toggles the light-mode class on the body', () => {
    toggleDarkMode();
    expect(document.body.classList.contains('light-mode')).toBe(false); 

    toggleDarkMode();
    expect(document.body.classList.contains('light-mode')).toBe(true); 
  });

  it('toggles the table-dark and table-light classes on the table', () => {
    const table = document.querySelector('.table');

    toggleDarkMode();
    expect(table.classList.contains('table-dark')).toBe(false); 
    expect(table.classList.contains('table-light')).toBe(true); 

    toggleDarkMode();
    expect(table.classList.contains('table-dark')).toBe(true); 
    expect(table.classList.contains('table-light')).toBe(false); 
  });
});
