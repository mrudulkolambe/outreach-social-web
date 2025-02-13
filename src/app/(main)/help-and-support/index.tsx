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
				<div className='flex-1 w-full bg-white overflow-hidden'>
					<div className='h-full w-full overflow-y-auto px-4 sm:px-6 lg:px-10'>
						<div className='py-6 sm:py-8 min-h-full'>
							<h2 className='text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4'>Help And Support</h2>
							<p className='text-sm sm:text-base text-gray-700 max-w-2xl'>
								We are always ready to help you from Monday until Friday, <span className='font-medium'>09:00 AM to 05:00 PM</span>. Contact us using the form below:
							</p>
							
							<form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-2xl mt-6 sm:mt-8 mb-8'>
								<div className='bg-accent/5 rounded-xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6'>
									<div>
										<label htmlFor="name" className='block text-sm sm:text-base font-medium mb-1.5'>
											Name <span className="text-red-500">*</span>
										</label>
										<input 
											type="text" 
											className={twMerge(
												'input w-full text-sm sm:text-base transition-colors',
												errors.name ? "border-red-500 focus:border-red-500" : "focus:border-accent"
											)} 
											id='name' 
											placeholder='Enter your full name'
											{...register("name", { required: true })} 
										/>
										{errors.name && (
											<p className="mt-1 text-xs sm:text-sm text-red-500">Name is required</p>
										)}
									</div>

									<div>
										<label htmlFor="email" className='block text-sm sm:text-base font-medium mb-1.5'>
											Email Address <span className="text-red-500">*</span>
										</label>
										<input 
											type="email" 
											className={twMerge(
												'input w-full text-sm sm:text-base transition-colors',
												errors.email ? "border-red-500 focus:border-red-500" : "focus:border-accent"
											)} 
											id='email' 
											placeholder='Enter your email address'
											{...register("email", { 
												required: true,
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Invalid email address"
												}
											})} 
										/>
										{errors.email && (
											<p className="mt-1 text-xs sm:text-sm text-red-500">
												{errors.email.type === 'pattern' ? 'Invalid email address' : 'Email is required'}
											</p>
										)}
									</div>

									<div>
										<label htmlFor="contact" className='block text-sm sm:text-base font-medium mb-1.5'>
											Contact Number <span className="text-red-500">*</span>
										</label>
										<input 
											type="tel" 
											className={twMerge(
												'input w-full text-sm sm:text-base transition-colors',
												errors.contact ? "border-red-500 focus:border-red-500" : "focus:border-accent"
											)} 
											id="contact"
											placeholder='Enter your contact number'
											{...register("contact", { 
												required: true,
												pattern: {
													value: /^[0-9+-]+$/,
													message: "Invalid phone number"
												}
											})} 
										/>
										{errors.contact && (
											<p className="mt-1 text-xs sm:text-sm text-red-500">
												{errors.contact.type === 'pattern' ? 'Invalid phone number' : 'Contact number is required'}
											</p>
										)}
									</div>

									<div>
										<label htmlFor="message" className='block text-sm sm:text-base font-medium mb-1.5'>
											Message <span className="text-red-500">*</span>
										</label>
										<textarea 
											className={twMerge(
												'input w-full h-24 sm:h-36 resize-none text-sm sm:text-base transition-colors',
												errors.message ? "border-red-500 focus:border-red-500" : "focus:border-accent"
											)} 
											id='message'
											placeholder='Write your message here...'
											{...register("message", { required: true })}
										></textarea>
										{errors.message && (
											<p className="mt-1 text-xs sm:text-sm text-red-500">Message is required</p>
										)}
									</div>

									<div className='pt-2 sm:pt-4'>
										<button 
											type='submit' 
											disabled={isFormLoading}
											className='button w-full sm:w-auto min-w-[120px] px-6 py-2.5 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all'
										>
											{isFormLoading ? <Spinner /> : "Submit Request"}
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</RootLayout>
	)
}

export default HelpAndSupport