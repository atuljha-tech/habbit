import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  habitProof: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(() => {
      return { userId: "user_123" } // Add your auth logic here
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter