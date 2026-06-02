import { test, expect } from '@playwright/test';

// Voorbeeld-suite. Breid uit tot de volledige matrix in BUILD.md §13.

test('home laadt en hoofd-CTA leidt naar de aanvraag', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /klicmelding aanvragen/i }).first().click();
  await expect(page).toHaveURL(/\/aanvragen/);
});

test('contactformulier valideert verplichte velden', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: /bericht versturen/i }).click();
  await expect(page.getByText(/verplicht|vul/i).first()).toBeVisible();
});

test('inloggen: link naar wachtwoord vergeten werkt', async ({ page }) => {
  await page.goto('/inloggen');
  await page.getByRole('link', { name: /wachtwoord vergeten/i }).click();
  await expect(page).toHaveURL(/wachtwoord-vergeten/);
});

test('aanvraagflow stap 1 → 2 met geldige invoer', async ({ page }) => {
  await page.goto('/aanvragen');
  await page.getByLabel(/soort klant/i).selectOption('particulier');
  await page.getByLabel(/^naam/i).fill('Jan de Tester');
  await page.getByLabel(/postcode/i).fill('5622 KH');
  await page.getByLabel(/huisnummer/i).fill('12');
  await page.getByLabel(/telefoon/i).fill('0612345678');
  await page.getByLabel(/e-mail/i).fill('jan@voorbeeld.nl');
  await page.getByRole('button', { name: /verder/i }).click();
  await expect(page.getByText(/graafmelding/i)).toBeVisible();
});
