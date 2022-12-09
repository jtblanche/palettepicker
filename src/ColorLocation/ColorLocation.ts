export default class ColorLocation {
    readonly stubIndex: number;
    readonly swatchIndex: number;

    public equalsStubIndexOnly(other: ColorLocation | null): boolean {
        return this.stubIndex == other?.stubIndex && this.swatchIndex != other?.swatchIndex;
    }

    public equalsSwatchIndexOnly(other: ColorLocation | null): boolean {
        return this.stubIndex != other?.stubIndex && this.swatchIndex == other?.swatchIndex;
    }

    public equals(other: ColorLocation | null): boolean {
        return this.stubIndex == other?.stubIndex && this.swatchIndex == other?.swatchIndex;
    }

    public constructor(
        stubIndex: number,
        swatchIndex: number
    ) {
        this.stubIndex = stubIndex;
        this.swatchIndex = swatchIndex;
    }
}