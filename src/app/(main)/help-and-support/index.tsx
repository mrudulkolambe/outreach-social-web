import Topbar from '@/components/Topbar'
import RootLayout from '../layout'
import { SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { createSupportRequest } from '@/service/supportService';
import { useState } from 'react';
import Spinner from '@/components/spinner';

type Inputs = {
	name: string,
	email: string,
	contact: string,
	message: string,
};

const HelpAndSupport = () => {

	const [isFormLoading, setIsFormLoading] = useState(false)

	const { register, handleSubmit, formState: { errors }, reset, } = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = async data => {
		setIsFormLoading(true)
		await createSupportRequest(data, reset)
		setIsFormLoading(false)
	}

	return (
		<RootLayout>
			<div className='flex flex-col h-screen max-h-screen'>
				<Topbar />
				<div className='flex flex-col items-start py-3 px-10 w-full bg-white primary-height overflow-hidden'>
					<h2 className='page-heading mb-2 text-black'>Help And Support</h2>
					<p>We always ready to help you from Monday until Friday on <span className='underline underline-offset-2'>09.00 AM until 05.00 PM</span>. Contact us with this following contact:</p>
					<form onSubmit={handleSubmit(onSubmit)} className='py-6 px-10 flex flex-col bg-accent/5 rounded-xl w-full mt-3 gap-3'>
						<div>
							<label htmlFor="name" className='label'>Name: </label>
							<input type="text" className={twMerge('input', errors.name && "border-red-600")} id='name' {...register("name", { required: true })} />
						</div>
						<div>
							<label htmlFor="email" className='label'>Email address: </label>
							<input type="email" className={twMerge('input', errors.email && "border-red-600")} id='email' {...register("email", { required: true })} />
						</div>
						<div>
							<label htmlFor="contact" className='label'>Contact number: </label>
							<input type="text" className={twMerge('input', errors.contact && "border-red-600")} id="contact" {...register("contact", { required: true })} />
						</div>
						<div>
							<label htmlFor="message" className='label'>Message: </label>
							<textarea className={twMerge('input h-36 resize-none', errors.message && "border-red-600")} id='message' {...register("message", { required: true })}  ></textarea>
						</div>
						<button type='submit' className='button'>{isFormLoading ? <Spinner /> : "Submit"}</button>
					</form>
				</div>
			</div>
		</RootLayout>
	)
}

export default HelpAndSupport