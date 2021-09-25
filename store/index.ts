import { Mutations } from './Challenges/types';

export const actions = {
	/** Função que é rodada sempre que o servidor Nuxt iniciar */
	nuxtServerInit({ commit }: any, { app }: any) {
		const cookie = app.$cookiz.get('movueit');

		if (cookie) {
			/** Um outro jeito de fazer o 'MapMutations' aonde o segundo argumento é o argumento passado para a mutation
			 * Além de que não estamos num componente Vue (.vue), então não há acesso à esses métodos
			 */
			commit(`Challenges/${Mutations.SAVE_COOKIE_DATA}`, cookie);
		}
	},
};
