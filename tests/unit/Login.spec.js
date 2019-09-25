import { shallowMount, createLocalVue } from '@vue/test-utils'
import Login from '@/components/user/Login';
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Login.vue', () => {

    let actions
    let store

    beforeEach(() => {
        actions = {
            login: jest.fn(),
        }
        store = new Vuex.Store({
            actions
        })
    })

        test('dispatches "login" when login button is submit', () => {
            const wrapper = shallowMount(Login, {localVue, store})
            const input = wrapper.find('input')
            input.element.value = 'admin'
            wrapper.find('.login-element-button').trigger('submit')
            expect(actions.login).toHaveBeenCalled()
        })

        test('does not dispatches "login" when input field is clickes', () => {
            const wrapper = shallowMount(Login, {localVue, store})
            wrapper.find('.login-element-input').trigger('click')
            expect(actions.login).not.toHaveBeenCalled()
        })

        test('is a Vue instance', () => {
            const wrapper = shallowMount(Login);
            expect(wrapper.isVueInstance()).toBeTruthy();
        });
});
