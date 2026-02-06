import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoadingService } from "../../../layout/Admins/service/loading.service";
import { ResponseHandlerService } from "../../../layout/Admins/service/responseHandler.service";
import { finalize } from "rxjs";
import { TranslationService } from "../../../../assets/i18n/translation.service";

@Injectable({ providedIn: 'root' })
export class FileExportService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private responseHandler: ResponseHandlerService,
    private translationService: TranslationService,

  ) { }
  /**
   * Gọi API và tải file về mà không bị browser block
   * @param url API endpoint
   * @param body payload
   * @param fileName tên file (không cần extension)
   * @param extension đuôi file: csv, xlsx, pdf, docx, ...
   */
  exportFile(url: string, body?: any, fileName?: string, extension: string = 'csv') {
    this.loadingService.show();

    this.responseHandler.handleApiCall(
      this.http.post(url, body, { responseType: 'blob' }),
      {
        isBlob: true,
        showSuccessMessage: false,
        errorMessage: this.translationService.translate("Common.ExportError")
      }
    )
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (blob: Blob) => {
          this.triggerDownload(blob, fileName, extension);
        },
        error: (err) => { }
      });
  }

  downloadFile(url: string, fileName?: string, extension: string = 'xlsx') {
    this.loadingService.show();

    this.responseHandler.handleApiCall(
      this.http.get(url, { responseType: 'blob' }),
      {
        isBlob: true,
        showSuccessMessage: false,
        errorMessage: this.translationService.translate("Common.ExportError")
      }
    )
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (blob: Blob) => {
          this.triggerDownload(blob, fileName, extension);
        },
        error: (err) => { }
      });
  }

  private triggerDownload(blob: Blob, fileName?: string, extension: string = 'csv') {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName ? `${fileName}.${extension}` : `export_${new Date().getTime()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  downloadPublicKeyPem(
    publicKeyBase64: string,
    fileName = 'public-key.pem'
  ) {
    const pemContent = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`;
    const blob = new Blob([pemContent], { type: 'application/x-pem-file' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }
}
