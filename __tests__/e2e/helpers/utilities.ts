import {expect, element, by} from 'detox';

const expectToBeVisible = async (id: string) => {
  try {
    await expect(element(by.id(id))).toBeVisible();
    return true;
  } catch (e) {
    return false;
  }
};

export default {expectToBeVisible};
