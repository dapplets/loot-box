import cn from 'classnames'
import React, { ReactElement, useEffect } from 'react'
import styles from './Modal.module.scss'

interface ModalProps {
  visible: boolean
  title: string
  content: ReactElement | string
  footer: ReactElement | string
  onClose: () => void
  className?: string
  subtitle?: string
  classNameSubtitle?: string
}

export const Modal = ({
  visible = false,
  title = '',
  content = '',
  footer = '',
  onClose,
  className,
  subtitle,
  classNameSubtitle,
}: ModalProps) => {
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  if (!visible) return null

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {!subtitle && <h6 className={cn(styles.modalTitle, className)}>{title}</h6>}
          {subtitle && (
            <div className={styles.blockTitle}>
              {' '}
              <h6 className={cn(styles.modalTitle, className)}>{title}</h6>
              <h6 className={cn(styles.modalTitle, classNameSubtitle)}>{subtitle}</h6>
            </div>
          )}
          <span className={styles.modalClose} onClick={onClose} />
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalContent}>{content}</div>
        </div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}
