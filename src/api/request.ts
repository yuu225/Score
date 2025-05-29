import { ElMessage } from 'element-plus';

// 统一的错误处理
export const handleError = (error: any) => {
  console.error('API Error:', error);
  ElMessage.error(error.message || '操作失败');
  return Promise.reject(error);
};

// 统一的成功提示
export const showSuccess = (message: string) => {
  ElMessage.success(message);
};

// 模拟API延迟
export const delay = (ms: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 请求包装器
export const withErrorHandler = async <T>(
  promise: Promise<T>,
  successMessage?: string
): Promise<T> => {
  try {
    await delay(); // 模拟网络延迟
    const result = await promise;
    if (successMessage) {
      showSuccess(successMessage);
    }
    return result;
  } catch (error) {
    return handleError(error);
  }
}; 