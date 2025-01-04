import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

const ReportDialog = ({ type, id, children }: { type: string, id: string, children: React.ReactElement }) => {
	const [showDialog, setShowDialog] = useState(false)
	console.log(type, id)
	return (
		<>
			<span onClick={() => setShowDialog(true)}>{children}</span>
			<Dialog open={showDialog}>
				{/* <DialogTrigger asChild>{children}</DialogTrigger> */}
				<DialogTitle>Report Post</DialogTitle>
				<DialogContent>

				</DialogContent>
			</Dialog>
		</>
	)
}

export default ReportDialog