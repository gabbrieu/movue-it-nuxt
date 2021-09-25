import { mount } from '@vue/test-utils';
import VueMeta from 'vue-meta';
import * as utils from '~/utils';
import Countdown from '~/components/molecules/Countdown.vue';
import Index from './index.vue';
import { setupLocalVueStore } from '~/store/helper';

jest.mock('~/utils');

describe('Pages:index', () => {
	const { localVue, configureStore } = setupLocalVueStore();
	localVue.use(VueMeta, { keyName: 'head' });
	let mountConfig: any;

	beforeEach(() => {
		jest.spyOn(utils, 'scrollToElement').mockReset();
		jest.spyOn(utils, 'getRandomNumber').mockReset();
		jest.spyOn(utils, 'playAudio').mockReset();
		jest.spyOn(utils, 'sendNotification').mockReset();

		globalThis.Notification = {
			requestPermission: jest.fn(),
			permission: 'default',
		} as any;

		mountConfig = {
			localVue,
			stubs: {
				Profile: true,
				CompletedChallenges: true,
				Countdown: true,
				Card: true,
			},
		};
	});

	const buildWrapper = (countdownState = {}, challengesState = {}) => {
		const store = configureStore(countdownState, challengesState);
		return {
			...mountConfig,
			store,
		};
	};

	describe('Snapshots', () => {
		it('should render all child components and start a cycle button', () => {
			const config = buildWrapper();
			const wrapper = mount(Index, config);

			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render all child components and abandon a cycle button', () => {
			const config = buildWrapper({ isActive: true });
			const wrapper = mount(Index, config);

			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render all child components and cycle completed button', () => {
			const config = buildWrapper({ hasCompleted: true });
			const wrapper = mount(Index, config);

			expect(wrapper.html()).toMatchSnapshot();
		});
	});

	describe('Meta info', () => {
		it('should have a meta title', () => {
			const config = buildWrapper();
			const wrapper = mount(Index, config) as any;

			expect(wrapper.vm.$metaInfo.title).toBe('Home | movue.it');
		});
	});

	describe('mounted', () => {
		it('should request Notification permission when mounted', () => {
			const config = buildWrapper();
			mount(Index, config);

			expect(global.Notification.requestPermission).toHaveBeenCalled();
		});
	});

	describe('Button clicks', () => {
		it('should start a cycle when start a cycle button is clicked', async () => {
			const config = buildWrapper();
			const wrapper = mount(Index, config);

			const button = wrapper.find('button');
			await button.trigger('click');

			const newButton = wrapper.find('button');
			expect(newButton.text()).toBe('Abandon cycle');
		});

		it('should abandon a cycle when abandon cycle button is clicked', async () => {
			const config = buildWrapper({ isActive: true });
			const wrapper = mount(Index, config);

			const button = wrapper.find('button');
			await button.trigger('click');

			const newButton = wrapper.find('button');
			expect(newButton.text()).toBe('Start a cycle');
		});
	});

	describe('Emitted events', () => {
		it('should run getNewChallenge and play audio and send notification', async () => {
			globalThis.Notification = {
				requestPermission: jest.fn(),
				permission: 'granted',
			} as any;

			jest.spyOn(utils, 'getRandomNumber').mockImplementationOnce(() => 1);
			const config = buildWrapper();
			const wrapper = mount(Index, config);

			const setCurrentChallengeIndex = jest.spyOn(
				wrapper.vm,
				'setCurrentChallengeIndex' as any,
			);

			const countdown = wrapper.findComponent(Countdown);
			await countdown.vm.$emit('completed');

			const button = wrapper.find('button');

			expect(button.text()).toBe('Cycle completed');
			expect(setCurrentChallengeIndex).toHaveBeenCalledWith(1);
			expect(utils.playAudio).toHaveBeenCalledWith('/notification.mp3');
			expect(utils.sendNotification).toHaveBeenCalledWith('New Challenge', {
				body: 'A new challenge has started! Go complete it!',
				icon: '/favicon.png',
			});
			expect(utils.scrollToElement).toHaveBeenCalledWith('#challenge');
		});

		it('should run getNewChallenge but doesnt play audio and doesnt send notification', async () => {
			jest.spyOn(utils, 'getRandomNumber').mockImplementationOnce(() => 1);

			const config = buildWrapper();
			const wrapper = mount(Index, config);

			const setCurrentChallengeIndex = jest.spyOn(
				wrapper.vm,
				'setCurrentChallengeIndex' as any,
			);

			const countdown = wrapper.findComponent(Countdown);
			await countdown.vm.$emit('completed');

			const button = wrapper.find('button');

			expect(button.text()).toBe('Cycle completed');
			expect(setCurrentChallengeIndex).toHaveBeenCalledWith(1);
			expect(utils.playAudio).not.toHaveBeenCalled();
			expect(utils.sendNotification).not.toHaveBeenCalled();
			expect(utils.scrollToElement).toHaveBeenCalledWith('#challenge');
		});
	});
});
