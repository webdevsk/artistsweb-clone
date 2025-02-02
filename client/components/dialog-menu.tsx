"use client"

import * as React from "react"
import type { ForwardedRef } from "react"
import { createContext, forwardRef, useContext, useState } from "react"
import Link from "next/link"
import { AnimatedLink } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"
import * as RadixDialog from "@radix-ui/react-dialog"
import { BlockSlideUp } from "./higher-order-block-animate-components"
import { TextFadeInByText, TextSlideUpByText } from "./higher-order-text-animate-components"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

const DialogOpenContext = createContext<boolean>(false)

export function DialogRoot({ children, ...props }: RadixDialog.DialogProps) {
  const [isOpen, setOpen] = useState<boolean>(false)

  return (
    <DialogOpenContext.Provider value={isOpen}>
      <RadixDialog.Root onOpenChange={setOpen} {...props}>
        {children}
      </RadixDialog.Root>
    </DialogOpenContext.Provider>
  )
}

export const DialogTrigger = RadixDialog.Trigger

const startDelay: number = 0.5
const endDelay: number = 0.3
// transition: {when: "beforeChildren"} doesnt work maybe due to Radix components in between motion components
const overlayVariants = {
  closed: { opacity: 0, transition: { duration: 0.5, delay: endDelay } },
  open: { opacity: 1, transition: { duration: startDelay } },
}

const dialogVariants = {
  initial: { opacity: 0, scaleY: 2, y: "-100%" },
  open: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: {
      default: { delay: startDelay, duration: 0.3, staggerChildren: 0.1 },
      scaleY: { delay: 0.3, duration: 0.8 },
    },
  },
  closed: { opacity: 0, transition: { duration: endDelay } },
}

let dialogContainer: HTMLDivElement

function getEnsureDialogContainer() {
  if (!dialogContainer) {
    dialogContainer = document.createElement("div")
    dialogContainer.className = "fixed inset-0 z-[999] grid place-items-center pointer-events-none"
    document.body.append(dialogContainer)
  }

  return dialogContainer
}

function DialogContentCore(
  { children, className, title, ...props }: RadixDialog.DialogContentProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const isOpen = useContext(DialogOpenContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <RadixDialog.Portal forceMount container={getEnsureDialogContainer()}>
          <RadixDialog.Overlay asChild>
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <RadixDialog.Content forceMount ref={forwardedRef} asChild {...props}>
                <motion.div
                  variants={dialogVariants}
                  initial="initial"
                  animate="open"
                  exit="closed"
                  className={cn(
                    "relative mx-auto flex max-w-[940px] origin-bottom items-center justify-center",
                    className
                  )}>
                  <RadixDialog.Title className="hidden">{title}</RadixDialog.Title>
                  {/* {children} */}
                  <div className="h-[90dvh] w-[940px] overflow-y-auto rounded-[calc(16px_+_16*(100vw_-_576px)/1024)] bg-foreground text-background [--padding:0_calc(32px_+_48*(100vw_-_576px)/1024)]">
                    <div className="*: sticky top-0 flex items-center justify-between bg-inherit p-[--padding] pt-[calc(32px_+_48*(100vw_-_576px)/1024)]">
                      <TextFadeInByText
                        as="h5"
                        className="font-base text-[calc(16px_+_8*(100vw_-_576px)/1024)] leading-snug">
                        Navigation
                      </TextFadeInByText>
                      <RadixDialog.Close className="group grid size-10 place-items-center rounded-full bg-[#ffffff26] transition-colors hover:bg-[#ffffff40]">
                        <X className="transition-transform group-hover:scale-110" />
                      </RadixDialog.Close>
                    </div>

                    <div className="p-[--padding]">
                      {/* Nav menu */}
                      <div className="my-[calc(16px_+_24*(100vw_-_576px)/1024)] space-y-4">
                        {["Case Studies", "Our Agency", "Contact Us", "News"].map((menu, i) => (
                          <motion.div
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.2, duration: 0.2 }}
                            viewport={{ once: false }}
                            style={{ opacity: 0 }}
                            key={menu}
                            className="flex items-center gap-4">
                            <AnimatedLink
                              href={`#`}
                              className="rounded-none border-0 bg-transparent p-0 text-[calc(32px_+_24*(100vw_-_576px)/1024)] font-semibold outline-none ring-0 hover:bg-transparent hover:ring-0">
                              {menu}
                            </AnimatedLink>

                            {menu === "Case Studies" && (
                              <div className="font-regular variant-h5 grid size-[72px] place-items-center rounded-full border border-muted">
                                <span>13</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-4 py-4">
                        <div className="font-base flex flex-wrap gap-x-8 gap-y-2 text-base">
                          <p className="block w-full text-muted">Follow Us</p>
                          {[
                            { href: "/", label: "Instagram" },
                            { href: "/", label: "LinkedIn" },
                            { href: "/", label: "Twitter" },
                            { href: "/", label: "Awwwards" },
                          ].map(({ href, label }, i) => (
                            <div key={label} className="overflow-hidden">
                              <motion.div
                                whileInView={{ translateY: "0%" }}
                                transition={{ delay: 0.3 + i * 0.2, duration: 0.2 }}
                                viewport={{ once: false }}
                                style={{ translateY: "100%" }}>
                                <Link
                                  href={href}
                                  className="relative before:absolute before:right-0 before:top-0 before:size-1 before:translate-y-2 before:border-r-[1.5px] before:border-t-[1.5px] before:border-background before:opacity-0 before:transition-all before:content-[''] hover:before:translate-x-2 hover:before:translate-y-0 hover:before:opacity-100">
                                  {label}
                                </Link>
                              </motion.div>
                            </div>
                          ))}
                        </div>
                        <BlockSlideUp transition={{ delay: 0.6, duration: 0.3 }}>
                          <AnimatedLink href="/admin">Admin Panel</AnimatedLink>
                        </BlockSlideUp>
                        {/* <div className="overflow-hidden">
                          <motion.div
                            whileInView={{ translateY: "0%", opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            viewport={{ once: false }}
                            style={{ translateY: "100%", opacity: 0 }}>
                          </motion.div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </RadixDialog.Content>
            </motion.div>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  )
}

export const DialogContent = forwardRef(DialogContentCore)
